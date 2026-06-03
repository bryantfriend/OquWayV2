export function normalizeTeacherLoginPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    valid: true,
    data: {
      email: normalizeEmail(payload.email),
      password: typeof payload.password === "string" ? payload.password : ""
    }
  };
}

export function normalizeTeacherPasswordResetPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    valid: true,
    data: {
      email: normalizeEmail(payload.email)
    }
  };
}

export function normalizeTeacherDashboardPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    valid: true,
    data: {
      classId: normalizeText(payload.classId),
      courseId: normalizeText(payload.courseId),
      moduleId: normalizeText(payload.moduleId),
      reviewStatus: normalizeText(payload.reviewStatus || "pending")
    }
  };
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}
