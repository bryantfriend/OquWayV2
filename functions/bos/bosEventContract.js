"use strict";

const crypto = require("crypto");

const PROJECT_KEY = "oquway";
const SCHEMA_VERSION = "1.0";
const SOURCE_VERSION = "bos-integration-v1";
const ALLOWED_EVENT_TYPES = ["course_published"];
const ALLOWED_ENVIRONMENTS = ["development", "staging", "production"];
const ALLOWED_RESULTS = ["succeeded", "failed", "partial", "observed"];
const COURSE_PUBLISHED_METRICS = ["courseVersion"];
const ALLOWED_EVENT_FIELDS = [
  "schemaVersion", "eventId", "projectKey", "eventType", "occurredAt", "environment",
  "result", "summary", "metrics", "evidenceRefs", "sourceSystem", "sourceVersion", "correlationId", "sensitivity"
];

function createStableEventId(eventType, authoritativeSourceEventId) {
  var input = PROJECT_KEY + "|" + eventType + "|" + authoritativeSourceEventId;
  var digest = crypto.createHash("sha256").update(input, "utf8").digest("hex");

  return "oquway-" + digest;
}

function buildCoursePublishedEvent(input) {
  var source = input || {};
  var course = source.course || {};
  var metrics = {};
  var courseVersion = readFiniteNumber(course.version);

  if (!source.sourceEventId) {
    throw new Error("BOS_SOURCE_EVENT_ID_REQUIRED");
  }

  if (courseVersion !== null) {
    metrics.courseVersion = courseVersion;
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    eventId: createStableEventId("course_published", source.sourceEventId),
    projectKey: PROJECT_KEY,
    eventType: "course_published",
    occurredAt: normalizeIsoTimestamp(source.occurredAt),
    environment: source.environment,
    result: "succeeded",
    summary: "A course publication was committed successfully.",
    metrics: metrics,
    evidenceRefs: ["firebase-event:" + source.sourceEventId],
    sourceSystem: PROJECT_KEY,
    sourceVersion: SOURCE_VERSION,
    correlationId: source.sourceEventId,
    sensitivity: "standard"
  };
}

function validateBosEvent(event) {
  var errors = [];

  if (!event || typeof event !== "object" || Array.isArray(event)) {
    return ["event must be an object"];
  }

  validateFieldKeys(event, ALLOWED_EVENT_FIELDS, errors);
  requireExactText(event.schemaVersion, SCHEMA_VERSION, "schemaVersion", errors);
  requireText(event.eventId, "eventId", errors);
  requireExactText(event.projectKey, PROJECT_KEY, "projectKey", errors);
  requireAllowedText(event.eventType, ALLOWED_EVENT_TYPES, "eventType", errors);
  requireIsoTimestamp(event.occurredAt, "occurredAt", errors);
  requireAllowedText(event.environment, ALLOWED_ENVIRONMENTS, "environment", errors);
  requireAllowedText(event.result, ALLOWED_RESULTS, "result", errors);
  requireText(event.summary, "summary", errors);
  requireObject(event.metrics, "metrics", errors);
  requireStringArray(event.evidenceRefs, "evidenceRefs", errors);
  requireExactText(event.sourceSystem, PROJECT_KEY, "sourceSystem", errors);
  requireText(event.sourceVersion, "sourceVersion", errors);
  requireExactText(event.sensitivity, "standard", "sensitivity", errors);

  if (typeof event.summary === "string" && event.summary.length > 200) {
    errors.push("summary must be 200 characters or fewer");
  }

  if (event.eventType === "course_published") {
    validateMetricKeys(event.metrics, COURSE_PUBLISHED_METRICS, errors);
  }

  return errors;
}

function validateFieldKeys(value, allowedKeys, errors) {
  Object.keys(value).forEach(function (key) {
    if (allowedKeys.indexOf(key) === -1) {
      errors.push("event contains a non-contract field");
    }
  });
}

function validateMetricKeys(metrics, allowedKeys, errors) {
  if (!metrics || typeof metrics !== "object" || Array.isArray(metrics)) {
    return;
  }

  Object.keys(metrics).forEach(function (key) {
    if (allowedKeys.indexOf(key) === -1) {
      errors.push("metrics contains a non-allowlisted field");
    }

    if (typeof metrics[key] !== "number" || !Number.isFinite(metrics[key])) {
      errors.push("metrics values must be finite numbers");
    }
  });
}

function normalizeIsoTimestamp(value) {
  var date = null;

  if (value instanceof Date) {
    date = value;
  } else if (value && typeof value.toDate === "function") {
    date = value.toDate();
  } else if (typeof value === "string" || typeof value === "number") {
    date = new Date(value);
  }

  if (!date || !Number.isFinite(date.getTime())) {
    throw new Error("BOS_OCCURRED_AT_INVALID");
  }

  return date.toISOString();
}

function readFiniteNumber(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return value;
}

function requireText(value, fieldName, errors) {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(fieldName + " is required");
  }
}

function requireExactText(value, expectedValue, fieldName, errors) {
  if (value !== expectedValue) {
    errors.push(fieldName + " must equal " + expectedValue);
  }
}

function requireAllowedText(value, allowedValues, fieldName, errors) {
  if (allowedValues.indexOf(value) === -1) {
    errors.push(fieldName + " is invalid");
  }
}

function requireIsoTimestamp(value, fieldName, errors) {
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) {
    errors.push(fieldName + " must be an ISO-8601 timestamp");
  }
}

function requireObject(value, fieldName, errors) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    errors.push(fieldName + " must be an object");
  }
}

function requireStringArray(value, fieldName, errors) {
  if (!Array.isArray(value)) {
    errors.push(fieldName + " must be an array");
    return;
  }

  value.forEach(function (item) {
    if (typeof item !== "string" || item.length === 0) {
      errors.push(fieldName + " must contain only non-empty strings");
    }
  });
}

module.exports = {
  ALLOWED_ENVIRONMENTS: ALLOWED_ENVIRONMENTS,
  ALLOWED_EVENT_TYPES: ALLOWED_EVENT_TYPES,
  PROJECT_KEY: PROJECT_KEY,
  buildCoursePublishedEvent: buildCoursePublishedEvent,
  createStableEventId: createStableEventId,
  validateBosEvent: validateBosEvent
};
