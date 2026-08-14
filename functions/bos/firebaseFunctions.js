"use strict";

const admin = require("firebase-admin");
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { BosEventPublisher } = require("./BosEventPublisher");
const {
  createCoursePublishedCaptureHandler,
  createOutboxDeliveryHandler
} = require("./bosOutbox");

const OUTBOX_COLLECTION = "_bosOutbox";

const captureBosCoursePublished = onDocumentWritten({
  document: "catalogCourses/{courseId}",
  retry: false
}, captureCoursePublished);

const captureBosLegacyCoursePublished = onDocumentWritten({
  document: "courses/{courseId}",
  retry: false
}, captureCoursePublished);

async function captureCoursePublished(event) {
  var config = readBosConfig(process.env);
  var handler = null;

  if (!config.enabled) {
    return;
  }

  handler = createCoursePublishedCaptureHandler({
    environment: config.environment,
    outboxRepository: createFirestoreOutboxRepository(admin.firestore())
  });

  await handler(event);
}

const deliverBosOutboxEvent = onDocumentWritten({
  document: OUTBOX_COLLECTION + "/{eventId}",
  retry: false,
  secrets: ["BOS_INTEGRATION_SECRET"]
}, async function (event) {
  var config = readBosConfig(process.env);
  var publisher = null;
  var handler = null;

  if (!config.enabled) {
    return;
  }

  publisher = new BosEventPublisher({
    endpoint: config.endpoint,
    integrationId: config.integrationId,
    secret: config.secret,
    timeoutMs: config.timeoutMs,
    maxAttempts: config.maxAttempts,
    baseDelayMs: config.baseDelayMs
  });
  handler = createOutboxDeliveryHandler({
    outboxRepository: createFirestoreOutboxRepository(admin.firestore()),
    publisher: publisher
  });

  await handler(event);
});

function createFirestoreOutboxRepository(db) {
  return {
    createIfAbsent: async function (eventId, record) {
      var documentReference = db.collection(OUTBOX_COLLECTION).doc(eventId);

      await db.runTransaction(async function (transaction) {
        var existingDocument = await transaction.get(documentReference);

        if (existingDocument.exists) {
          return;
        }

        transaction.create(documentReference, Object.assign({}, record, {
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        }));
      });
    },
    markDelivered: async function (eventId, result) {
      await db.collection(OUTBOX_COLLECTION).doc(eventId).set({
        status: "delivered",
        attemptCount: result.attempts,
        duplicateAccepted: result.duplicate,
        responseStatus: result.responseStatus,
        deliveredAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    },
    markFailed: async function (eventId, failure) {
      await db.collection(OUTBOX_COLLECTION).doc(eventId).set({
        status: "failed",
        attemptCount: failure.attemptCount,
        failureCode: failure.code,
        failedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }
  };
}

function readBosConfig(environmentVariables) {
  var source = environmentVariables || {};

  return {
    enabled: String(source.BOS_ENABLED || "false").toLowerCase() === "true",
    endpoint: source.BOS_EVENTS_ENDPOINT,
    integrationId: source.BOS_INTEGRATION_ID,
    secret: source.BOS_INTEGRATION_SECRET,
    environment: source.BOS_ENVIRONMENT,
    timeoutMs: source.BOS_TIMEOUT_MS,
    maxAttempts: source.BOS_MAX_ATTEMPTS,
    baseDelayMs: source.BOS_RETRY_BASE_DELAY_MS
  };
}

module.exports = {
  captureBosCoursePublished: captureBosCoursePublished,
  captureBosLegacyCoursePublished: captureBosLegacyCoursePublished,
  createFirestoreOutboxRepository: createFirestoreOutboxRepository,
  deliverBosOutboxEvent: deliverBosOutboxEvent,
  readBosConfig: readBosConfig
};
