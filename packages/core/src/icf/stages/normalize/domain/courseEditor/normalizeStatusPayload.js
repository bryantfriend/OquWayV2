export function normalizeCourseStatusPayload(executionState) {
  var payload = executionState.payload || {};
  var status = normalizeStatus(payload.status, ["draft", "published", "archived"]);

  return {
    valid: true,
    data: {
      courseId: readText(payload.courseId),
      status: status
    }
  };
}

export function normalizeModuleStatusPayload(executionState) {
  var payload = executionState.payload || {};
  var status = normalizeStatus(payload.status, ["draft", "published", "archived", "deleted"]);

  return {
    valid: true,
    data: {
      courseId: readText(payload.courseId),
      moduleId: readText(payload.moduleId),
      status: status
    }
  };
}

function normalizeStatus(value, allowedStatuses) {
  var status = readText(value).toLowerCase();

  if (allowedStatuses.indexOf(status) !== -1) {
    return status;
  }

  return "";
}

function readText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}
