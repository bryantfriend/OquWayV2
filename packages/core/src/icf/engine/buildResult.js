// buildResult.js

export function buildResult(executionState) {
  const intentType = readProperty(executionState, "intentType", "UnknownIntent");
  const actor = readProperty(executionState, "actor", null);
  const context = readProperty(executionState, "context", null);
  const result = readProperty(executionState, "result", null);
  const errors = readArrayProperty(executionState, "errors");
  const warnings = readArrayProperty(executionState, "warnings");
  const startTime = readProperty(executionState, "startTime", null);
  const endTime = readProperty(executionState, "endTime", null);

  const duration = calculateDuration(startTime, endTime);
  const success = errors.length === 0;

  const actorId = readActorField(actor, "id");
  const actorRole = readActorField(actor, "role");
  const locationId = readContextField(context, "locationId");
  const tenantId = readContextField(context, "tenantId");
  const regionId = readContextField(context, "regionId");

  const emitted = {
    ok: success,
    success: success,
    intentType: intentType,
    timestamp: endTime,
    duration: duration,
    actorId: actorId,
    actorRole: actorRole,
    locationId: locationId,
    tenantId: tenantId,
    regionId: regionId,
    data: success ? result : null,
    errors: success ? [] : normalizeErrors(errors),
    warnings: normalizeWarnings(warnings)
  };

  // Audit Record (immutable)
  const auditRecord = {
    intentType: intentType,
    actorId: actorId,
    actorRole: actorRole,
    locationId: locationId,
    tenantId: tenantId,
    regionId: regionId,
    ok: success,
    success: success,
    duration: duration,
    timestamp: endTime,
    warningCount: warnings.length
  };

  return {
    emitted: emitted,
    audit: auditRecord
  };
}


/* -------------------------------
   INTERNAL HELPERS
-------------------------------- */

function readProperty(obj, key, fallback) {
  if (!obj) {
    return fallback;
  }

  if (typeof obj[key] === "undefined") {
    return fallback;
  }

  return obj[key];
}

function readArrayProperty(obj, key) {
  if (!obj) {
    return [];
  }

  if (!Array.isArray(obj[key])) {
    return [];
  }

  return obj[key];
}

function readActorField(actor, field) {
  if (!actor) {
    return null;
  }

  if (typeof actor[field] === "undefined") {
    return null;
  }

  return actor[field];
}

function readContextField(context, field) {
  if (!context) {
    return null;
  }

  if (typeof context[field] === "undefined") {
    return null;
  }

  return context[field];
}

function calculateDuration(startTime, endTime) {
  if (typeof startTime !== "number" || typeof endTime !== "number") {
    return 0;
  }

  return endTime - startTime;
}

function normalizeErrors(errors) {
  const normalized = [];
  let errorIndex = 0;

  while (errorIndex < errors.length) {
    normalized.push(normalizeErrorEntry(errors[errorIndex]));
    errorIndex = errorIndex + 1;
  }

  return normalized;
}

function normalizeErrorEntry(err) {
  if (typeof err === "string") {
    return { code: err };
  }

  if (err && err.code) {
    return {
      code: err.code,
      message: err.message || null,
      stage: err.stage || null
    };
  }

  if (err && err.message) {
    return {
      code: "STAGE_ERROR",
      message: err.message,
      stage: err.stage || null
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: JSON.stringify(err)
  };
}

function normalizeWarnings(warnings) {
  const normalized = [];
  let warningIndex = 0;

  while (warningIndex < warnings.length) {
    normalized.push(normalizeWarningEntry(warnings[warningIndex]));
    warningIndex = warningIndex + 1;
  }

  return normalized;
}

function normalizeWarningEntry(warning) {
  if (typeof warning === "string") {
    return { message: warning };
  }

  if (warning && warning.message) {
    return {
      code: warning.code || null,
      message: warning.message
    };
  }

  return {
    code: "UNKNOWN_WARNING",
    message: JSON.stringify(warning)
  };
}