export function normalizeCourseAssignmentPayload(executionState) {
  var payload = executionState.payload || {};
  var targetType = normalizeTargetType(payload.targetType);
  var locationId = normalizeText(payload.locationId);
  var classId = normalizeText(payload.classId);
  var studentId = normalizeText(payload.studentId);

  return {
    assignmentType: normalizeAssignmentType(payload.assignmentType),
    courseId: normalizeText(payload.courseId),
    moduleId: normalizeText(payload.moduleId) || null,
    targetType: targetType,
    targetId: normalizeTargetId(payload.targetId, targetType, locationId, classId, studentId),
    locationId: locationId,
    classId: targetType === "class" ? classId : "",
    studentId: targetType === "student" ? studentId : "",
    status: normalizeStatus(payload.status),
    startsAt: normalizeNullableText(payload.startsAt),
    dueAt: normalizeNullableText(payload.dueAt),
    visibility: normalizeVisibility(payload.visibility)
  };
}

export function normalizeCourseAssignmentUpdatePayload(executionState) {
  var payload = executionState.payload || {};

  return {
    assignmentId: normalizeText(payload.assignmentId),
    status: normalizeStatus(payload.status)
  };
}

export function normalizeCourseAssignmentDisablePayload(executionState) {
  var payload = executionState.payload || {};

  return {
    assignmentId: normalizeText(payload.assignmentId),
    status: "disabled"
  };
}

export function normalizeCourseAssignmentListPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    courseId: normalizeText(payload.courseId),
    targetType: normalizeText(payload.targetType),
    targetId: normalizeText(payload.targetId),
    status: normalizeText(payload.status)
  };
}

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeNullableText(value) {
  var text = normalizeText(value);

  return text || null;
}

function normalizeAssignmentType(value) {
  return normalizeText(value) === "module" ? "module" : "course";
}

function normalizeTargetType(value) {
  return normalizeText(value) === "student" ? "student" : "class";
}

function normalizeTargetId(value, targetType, locationId, classId, studentId) {
  var targetId = normalizeText(value);

  if (targetId) {
    return targetId;
  }

  if (targetType === "student") {
    return studentId;
  }

  if (targetType === "class") {
    return classId;
  }

  return locationId;
}

function normalizeStatus(value) {
  var status = normalizeText(value);

  if (status === "paused" || status === "archived" || status === "disabled") {
    return status;
  }

  return "active";
}

function normalizeVisibility(value) {
  var visibility = normalizeText(value);

  if (visibility === "hidden") {
    return "hidden";
  }

  return "visible";
}
