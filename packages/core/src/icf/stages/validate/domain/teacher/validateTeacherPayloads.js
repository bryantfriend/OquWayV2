export function validateTeacherLoginPayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isEmail(payload.email)) {
    errors.push(createError("TEACHER_EMAIL_REQUIRED", "Teacher email is required."));
  }

  if (typeof payload.password !== "string" || payload.password.length < 1) {
    errors.push(createError("TEACHER_PASSWORD_REQUIRED", "Teacher password is required."));
  }

  return errors.length > 0 ? { valid: false, errors: errors } : { valid: true };
}

export function validateTeacherPasswordResetPayload(executionState) {
  var payload = executionState.payload || {};

  if (!isEmail(payload.email)) {
    return {
      valid: false,
      errors: [createError("TEACHER_EMAIL_REQUIRED", "Enter the teacher email to send a reset link.")]
    };
  }

  return { valid: true };
}

export function validateTeacherClassPayload(executionState) {
  var payload = executionState.payload || {};

  if (!payload.classId) {
    return { valid: true };
  }

  if (typeof payload.classId !== "string") {
    return {
      valid: false,
      errors: [createError("TEACHER_CLASS_ID_INVALID", "Class ID must be text.")]
    };
  }

  return { valid: true };
}

export function validateTeacherReviewQueuePayload(executionState) {
  var payload = executionState.payload || {};
  var validStatuses = ["", "pending", "complete", "needsWork", "incomplete"];

  if (payload.reviewStatus && validStatuses.indexOf(payload.reviewStatus) === -1) {
    return {
      valid: false,
      errors: [createError("TEACHER_REVIEW_STATUS_INVALID", "Review status filter is not supported.")]
    };
  }

  return { valid: true };
}

function isEmail(value) {
  return typeof value === "string"
    && value.indexOf("@") > 0
    && value.indexOf(".") > value.indexOf("@") + 1;
}

function createError(code, message) {
  return {
    code: code,
    message: message
  };
}
