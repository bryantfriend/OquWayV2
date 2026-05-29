export function normalizeCourseAssignmentPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    courseId: normalizeText(payload.courseId),
    targetType: normalizeText(payload.targetType),
    targetId: normalizeText(payload.targetId),
    status: normalizeStatus(payload.status)
  };
}

export function normalizeCourseAssignmentUpdatePayload(executionState) {
  var payload = executionState.payload || {};

  return {
    assignmentId: normalizeText(payload.assignmentId),
    status: normalizeStatus(payload.status)
  };
}

export function normalizeCourseAssignmentListPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    courseId: normalizeText(payload.courseId),
    status: normalizeText(payload.status)
  };
}

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeStatus(value) {
  var status = normalizeText(value);

  if (status === "paused" || status === "archived") {
    return status;
  }

  return "active";
}
