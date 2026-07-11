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

export function validateTeacherAttendanceQueryPayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isOptionalText(payload.classId)) {
    errors.push(createError("TEACHER_ATTENDANCE_CLASS_INVALID", "Class ID must be text."));
  }

  if (payload.attendanceDate && !isIsoDate(payload.attendanceDate)) {
    errors.push(createError("TEACHER_ATTENDANCE_DATE_INVALID", "Attendance date must use YYYY-MM-DD."));
  }

  return errors.length > 0 ? { valid: false, errors: errors } : { valid: true };
}

export function validateTeacherAttendanceSavePayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];
  var statuses = payload.statuses || {};
  var studentIds = Object.keys(statuses);
  var index = 0;

  if (!isOptionalText(payload.classId) || !payload.classId) {
    errors.push(createError("TEACHER_ATTENDANCE_CLASS_REQUIRED", "Choose a class before saving attendance."));
  }

  if (!isIsoDate(payload.attendanceDate)) {
    errors.push(createError("TEACHER_ATTENDANCE_DATE_REQUIRED", "Attendance date must use YYYY-MM-DD."));
  }

  if (!statuses || typeof statuses !== "object" || Array.isArray(statuses)) {
    errors.push(createError("TEACHER_ATTENDANCE_STATUSES_REQUIRED", "Attendance statuses are required."));
  }

  while (index < studentIds.length) {
    if (!isAttendanceStatus(statuses[studentIds[index]])) {
      errors.push(createError("TEACHER_ATTENDANCE_STATUS_INVALID", "Attendance status is not supported."));
      break;
    }
    index = index + 1;
  }

  return errors.length > 0 ? { valid: false, errors: errors } : { valid: true };
}

export function validateTeacherStudentDetailPayload(executionState) {
  var payload = executionState.payload || {};

  if (!isOptionalText(payload.studentId) || !payload.studentId) {
    return {
      valid: false,
      errors: [createError("TEACHER_STUDENT_ID_REQUIRED", "Choose a student to view detail.")]
    };
  }

  return { valid: true };
}
function isEmail(value) {
  return typeof value === "string"
    && value.indexOf("@") > 0
    && value.indexOf(".") > value.indexOf("@") + 1;
}

function isOptionalText(value) {
  return value == null || typeof value === "string";
}

function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isAttendanceStatus(value) {
  return value === "present"
    || value === "absent"
    || value === "late"
    || value === "excused"
    || value === "";
}
function createError(code, message) {
  return {
    code: code,
    message: message
  };
}
