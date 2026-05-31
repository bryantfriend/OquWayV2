export function validateCourseAssignmentPayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isNonEmptyText(payload.courseId)) {
    errors.push({
      code: "COURSE_ASSIGNMENT_COURSE_REQUIRED",
      message: "Course assignment requires a courseId."
    });
  }

  var targetType = readText(payload.targetType) || "class";

  if (!isValidTargetType(targetType)) {
    errors.push({
      code: "COURSE_ASSIGNMENT_TARGET_TYPE_INVALID",
      message: "Course assignment targetType must be class or student."
    });
  }

  if (targetType === "class" && !isNonEmptyText(payload.classId) && !isNonEmptyText(payload.targetId)) {
    errors.push({
      code: "COURSE_ASSIGNMENT_TARGET_REQUIRED",
      message: "Choose a class for this course assignment."
    });
  }

  if (targetType === "student" && !isNonEmptyText(payload.studentId) && !isNonEmptyText(payload.targetId)) {
    errors.push({
      code: "COURSE_ASSIGNMENT_TARGET_REQUIRED",
      message: "Choose a student for this course assignment."
    });
  }

  if (payload.status && !isValidStatus(readText(payload.status))) {
    errors.push({
      code: "COURSE_ASSIGNMENT_STATUS_INVALID",
      message: "Course assignment status must be active, paused, disabled, or archived."
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
      message: "Course assignment status must be active, paused, disabled, or archived."
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
  return value === "class" || value === "student";
}

function isValidStatus(value) {
  return value === "active" || value === "paused" || value === "disabled" || value === "archived";
}
