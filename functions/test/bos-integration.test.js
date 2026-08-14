"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const test = require("node:test");
const {
  buildCoursePublishedEvent,
  createStableEventId,
  validateBosEvent
} = require("../bos/bosEventContract");
const {
  BosEventPublisher,
  createSignature
} = require("../bos/BosEventPublisher");
const {
  createCoursePublishedCaptureHandler,
  createOutboxDeliveryHandler,
  isCoursePublication
} = require("../bos/bosOutbox");

const TEST_SECRET = "test-secret-at-least-16-characters";

test("validates the supported BOS payload", function () {
  var event = createEvent();

  assert.deepEqual(validateBosEvent(event), []);

  event.environment = "preview";
  event.metrics.studentId = 123;
  event.studentEmail = "private@example.test";

  assert.deepEqual(validateBosEvent(event), [
    "event contains a non-contract field",
    "environment is invalid",
    "metrics contains a non-allowlisted field"
  ]);
});

test("derives stable event IDs from the authoritative Firebase event", function () {
  var first = createStableEventId("course_published", "firebase-event-123");
  var second = createStableEventId("course_published", "firebase-event-123");
  var different = createStableEventId("course_published", "firebase-event-456");

  assert.equal(first, second);
  assert.notEqual(first, different);
  assert.match(first, /^oquway-[a-f0-9]{64}$/);
});

test("signs timestamp and exact request body with HMAC SHA-256", function () {
  var timestamp = "1785441600";
  var body = "{\"eventId\":\"event-1\"}";
  var expected = "sha256=" + crypto.createHmac("sha256", TEST_SECRET)
    .update(timestamp + "." + body, "utf8")
    .digest("hex");

  assert.equal(createSignature(TEST_SECRET, timestamp, body), expected);
});

test("delivers a signed event successfully", async function () {
  var request = null;
  var publisher = createPublisher({
    fetchImplementation: async function (url, options) {
      request = { url: url, options: options };
      return { status: 202 };
    }
  });
  var event = createEvent();
  var result = await publisher.publish(event);

  assert.equal(result.accepted, true);
  assert.equal(result.duplicate, false);
  assert.equal(request.url, "https://bos.example.test/v1/integration-events");
  assert.equal(request.options.headers["Idempotency-Key"], event.eventId);
  assert.equal(request.options.headers["X-BOS-Integration-Id"], "integration-test");
  assert.match(request.options.headers["X-BOS-Signature"], /^sha256=[a-f0-9]{64}$/);
  assert.deepEqual(JSON.parse(request.options.body), event);
});

test("retries retryable responses with bounded exponential delays", async function () {
  var statuses = [503, 429, 202];
  var delays = [];
  var publisher = createPublisher({
    maxAttempts: 3,
    baseDelayMs: 10,
    fetchImplementation: async function () {
      return { status: statuses.shift() };
    },
    sleepImplementation: async function (milliseconds) {
      delays.push(milliseconds);
    }
  });
  var result = await publisher.publish(createEvent());

  assert.equal(result.attempts, 3);
  assert.deepEqual(delays, [10, 20]);
});

test("times out requests and stops at the configured attempt bound", async function () {
  var attempts = 0;
  var publisher = createPublisher({
    maxAttempts: 2,
    timeoutMs: 100,
    baseDelayMs: 1,
    sleepImplementation: async function () {},
    fetchImplementation: function (url, options) {
      attempts += 1;

      return new Promise(function (resolve, reject) {
        options.signal.addEventListener("abort", function () {
          var error = new Error("contains-" + TEST_SECRET);
          error.name = "AbortError";
          reject(error);
        });
      });
    }
  });

  await assert.rejects(publisher.publish(createEvent()), function (error) {
    assert.equal(error.code, "BOS_TIMEOUT");
    assert.equal(String(error.message).includes(TEST_SECRET), false);
    return true;
  });
  assert.equal(attempts, 2);
});

test("treats duplicate acceptance as success", async function () {
  var publisher = createPublisher({
    fetchImplementation: async function () {
      return { status: 409 };
    }
  });
  var result = await publisher.publish(createEvent());

  assert.equal(result.accepted, true);
  assert.equal(result.duplicate, true);
  assert.equal(result.responseStatus, 409);
});

test("reports BOS unavailable without exposing receiver errors or secrets", async function () {
  var loggedMetadata = [];
  var attempts = 0;
  var publisher = createPublisher({
    maxAttempts: 2,
    sleepImplementation: async function () {},
    fetchImplementation: async function () {
      attempts += 1;
      throw new Error("receiver exposed " + TEST_SECRET);
    },
    logger: {
      info: function () {},
      warn: function (message, metadata) {
        loggedMetadata.push({ message: message, metadata: metadata });
      }
    }
  });

  await assert.rejects(publisher.publish(createEvent()), function (error) {
    assert.equal(error.code, "BOS_UNAVAILABLE");
    assert.equal(JSON.stringify(error).includes(TEST_SECRET), false);
    return true;
  });
  assert.equal(attempts, 2);
  assert.equal(JSON.stringify(loggedMetadata).includes(TEST_SECRET), false);
  assert.equal(JSON.stringify(loggedMetadata).includes("integration-test"), false);
});

test("rejects invalid configuration before making a request", async function () {
  var called = false;
  var publisher = new BosEventPublisher({
    endpoint: "http://insecure.example.test",
    integrationId: "",
    secret: "short",
    fetchImplementation: async function () {
      called = true;
      return { status: 202 };
    }
  });

  await assert.rejects(publisher.publish(createEvent()), function (error) {
    assert.equal(error.code, "BOS_CONFIG_INVALID");
    return true;
  });
  assert.equal(called, false);
});

test("course event construction excludes student and user-generated content", function () {
  var event = buildCoursePublishedEvent({
    sourceEventId: "firebase-event-private-input",
    occurredAt: "2026-07-30T20:00:00.000Z",
    environment: "production",
    course: {
      version: 7,
      moduleCount: 4,
      title: "Private course title",
      updatedBy: "student-identity",
      student: { email: "student@example.test", grade: 99 },
      reflection: "private reflection",
      uploadUrl: "https://private.example.test/photo.jpg"
    }
  });
  var serialized = JSON.stringify(event);

  assert.equal(serialized.includes("Private course title"), false);
  assert.equal(serialized.includes("student-identity"), false);
  assert.equal(serialized.includes("student@example.test"), false);
  assert.equal(serialized.includes("private reflection"), false);
  assert.equal(serialized.includes("photo.jpg"), false);
  assert.deepEqual(event.metrics, { courseVersion: 7 });
});

test("captures only authoritative publication transitions", function () {
  assert.equal(isCoursePublication({ status: "draft", version: 1 }, { status: "published", version: 2 }), true);
  assert.equal(isCoursePublication({ status: "published", version: 2 }, { status: "published", version: 3 }), true);
  assert.equal(isCoursePublication({ status: "published", version: 3 }, { status: "published", version: 3 }), false);
  assert.equal(isCoursePublication({ status: "draft", version: 1 }, { status: "draft", version: 2 }), false);
});

test("BOS failure is isolated from the already-committed course publication", async function () {
  var createdRecords = [];
  var failedRecords = [];
  var outboxRepository = {
    createIfAbsent: async function (eventId, record) {
      createdRecords.push({ eventId: eventId, record: record });
    },
    markDelivered: async function () {},
    markFailed: async function (eventId, failure) {
      failedRecords.push({ eventId: eventId, failure: failure });
    }
  };
  var capture = createCoursePublishedCaptureHandler({
    environment: "production",
    outboxRepository: outboxRepository
  });
  var captureResult = await capture({
    id: "firebase-event-committed",
    time: "2026-07-30T20:00:00.000Z",
    data: {
      before: { status: "draft", version: 1 },
      after: { status: "published", version: 2 }
    }
  });
  var delivery = createOutboxDeliveryHandler({
    outboxRepository: outboxRepository,
    publisher: {
      maxAttempts: 3,
      publish: async function () {
        var error = new Error("offline");
        error.code = "BOS_UNAVAILABLE";
        throw error;
      }
    }
  });
  var deliveryResult = await delivery({
    params: { eventId: createdRecords[0].eventId },
    data: { after: createdRecords[0].record }
  });

  assert.equal(captureResult.captured, true);
  assert.equal(createdRecords.length, 1);
  assert.equal(deliveryResult.delivered, false);
  assert.equal(failedRecords.length, 1);
  assert.equal(failedRecords[0].failure.code, "BOS_UNAVAILABLE");
});

function createEvent() {
  return buildCoursePublishedEvent({
    sourceEventId: "firebase-event-123",
    occurredAt: "2026-07-30T20:00:00.000Z",
    environment: "development",
    course: { version: 2, moduleCount: 3 }
  });
}

function createPublisher(overrides) {
  return new BosEventPublisher(Object.assign({
    endpoint: "https://bos.example.test/v1/integration-events",
    integrationId: "integration-test",
    secret: TEST_SECRET,
    maxAttempts: 1,
    timeoutMs: 1000,
    baseDelayMs: 1,
    nowImplementation: function () {
      return 1785441600000;
    },
    logger: {
      info: function () {},
      warn: function () {}
    }
  }, overrides || {}));
}
