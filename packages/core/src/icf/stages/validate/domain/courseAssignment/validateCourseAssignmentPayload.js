export function validateCourseAssignmentPayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isNonEmptyText(payload.courseId)) {
    errors.push({
      code: "COURSE_ASSIGNMENT_COURSE_REQUIRED",
      message: "Course assignment requires a courseId."
    });
  }

  if (!isValidTargetType(readText(payload.targetType))) {
    errors.push({
      code: "COURSE_ASSIGNMENT_TARGET_TYPE_INVALID",
      message: "Course assignment targetType must be location, class, or student."
    });
  }

  if (!isNonEmptyText(payload.targetId)) {
    errors.push({
      code: "COURSE_ASSIGNMENT_TARGET_REQUIRED",
      message: "Course assignment requires a targetId."
    });
  }

  if (payload.status && !isValidStatus(readText(payload.status))) {
    errors.push({
      code: "COURSE_ASSIGNMENT_STATUS_INVALID",
      message: "Course assignment status must be active, paused, or archived."
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors
    };
  }

  return { valid: true };
}

export function validateCourseAssignmentId(executionState) {
  var payload = executionState.payload || {};

  if (!isNonEmptyText(payload.assignmentId)) {
    return {
      valid: false,
      errors: [
        {
          code: "COURSE_ASSIGNMENT_ID_REQUIRED",
          message: "Course assignment action requires an assignmentId."
        }
      ]
    };
  }

  return { valid: true };
}

export function validateCourseAssignmentUpdatePayload(executionState) {
  var payload = executionState.payload || {};

  if (payload.status && !isValidStatus(readText(payload.status))) {
    return {
      valid: false,
      errors: [
        {
          code: "COURSE_ASSIGNMENT_STATUS_INVALID",
          message: "Course assignment status must be active, paused, or archived."
        }
      ]
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

function isValidTargetType(value) {
  return value === "location" || value === "class" || value === "student";
}

function isValidStatus(value) {
  return value === "active" || value === "paused" || value === "archived";
}
