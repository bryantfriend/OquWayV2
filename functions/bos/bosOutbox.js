"use strict";

const { buildCoursePublishedEvent } = require("./bosEventContract");

function isCoursePublication(beforeCourse, afterCourse) {
  var before = beforeCourse || {};
  var after = afterCourse || {};
  var beforeVersion = readFiniteNumber(before.version);
  var afterVersion = readFiniteNumber(after.version);

  if (after.status !== "published") {
    return false;
  }

  if (before.status !== "published") {
    return true;
  }

  return beforeVersion !== null
    && afterVersion !== null
    && afterVersion > beforeVersion;
}

function createCoursePublishedCaptureHandler(dependencies) {
  var outboxRepository = dependencies.outboxRepository;
  var environment = dependencies.environment;

  return async function (sourceEvent) {
    var beforeCourse = readSnapshotData(sourceEvent.data && sourceEvent.data.before);
    var afterCourse = readSnapshotData(sourceEvent.data && sourceEvent.data.after);
    var event = null;

    if (!isCoursePublication(beforeCourse, afterCourse)) {
      return { captured: false, reason: "not-a-publication" };
    }

    event = buildCoursePublishedEvent({
      sourceEventId: sourceEvent.id,
      occurredAt: sourceEvent.time,
      environment: environment,
      course: afterCourse
    });

    await outboxRepository.createIfAbsent(event.eventId, {
      schemaVersion: "1.0",
      status: "pending",
      eventType: event.eventType,
      payload: event,
      attemptCount: 0
    });

    return { captured: true, eventId: event.eventId };
  };
}

function createOutboxDeliveryHandler(dependencies) {
  var outboxRepository = dependencies.outboxRepository;
  var publisher = dependencies.publisher;

  return async function (sourceEvent) {
    var record = readSnapshotData(sourceEvent.data && sourceEvent.data.after);
    var result = null;

    if (!record || record.status !== "pending") {
      return { delivered: false, reason: "not-pending" };
    }

    try {
      result = await publisher.publish(record.payload);
      await outboxRepository.markDelivered(sourceEvent.params.eventId, result);
      return { delivered: true, result: result };
    } catch (error) {
      await outboxRepository.markFailed(sourceEvent.params.eventId, {
        attemptCount: readAttemptCount(error),
        code: readSafeErrorCode(error)
      });

      return { delivered: false, reason: readSafeErrorCode(error) };
    }
  };
}

function readSnapshotData(snapshot) {
  if (!snapshot) {
    return null;
  }

  if (snapshot.exists === false) {
    return null;
  }

  if (typeof snapshot.data === "function") {
    return snapshot.data() || null;
  }

  return snapshot;
}

function readSafeErrorCode(error) {
  if (error && typeof error.code === "string" && /^BOS_[A-Z_]+$/.test(error.code)) {
    return error.code;
  }

  return "BOS_DELIVERY_FAILED";
}

function readAttemptCount(error) {
  var attemptCount = error && error.details ? error.details.attempts : 0;

  if (!Number.isInteger(attemptCount) || attemptCount < 0) {
    return 0;
  }

  return attemptCount;
}

function readFiniteNumber(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return value;
}

module.exports = {
  createCoursePublishedCaptureHandler: createCoursePublishedCaptureHandler,
  createOutboxDeliveryHandler: createOutboxDeliveryHandler,
  isCoursePublication: isCoursePublication
};
