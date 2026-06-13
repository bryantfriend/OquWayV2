export function validateCourseStatusPayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isNonEmptyText(payload.courseId)) {
    errors.push({ code: "COURSE_ID_REQUIRED", message: "Course action requires a courseId." });
  }

  if (["draft", "published", "archived"].indexOf(readText(payload.status)) === -1) {
    errors.push({ code: "COURSE_STATUS_INVALID", message: "Course status must be draft, published, or archived." });
  }

  return buildResult(errors);
}

export function validateModuleStatusPayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isNonEmptyText(payload.courseId)) {
    errors.push({ code: "COURSE_ID_REQUIRED", message: "Module action requires a courseId." });
  }

  if (!isNonEmptyText(payload.moduleId)) {
    errors.push({ code: "MODULE_ID_REQUIRED", message: "Module action requires a moduleId." });
  }

  if (["draft", "published", "archived", "deleted"].indexOf(readText(payload.status)) === -1) {
    errors.push({ code: "MODULE_STATUS_INVALID", message: "Module status must be draft, published, archived, or deleted." });
  }

  return buildResult(errors);
}

function buildResult(errors) {
  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors
    };
  }

  return { valid: true };
}

function isNonEmptyText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function readText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}
