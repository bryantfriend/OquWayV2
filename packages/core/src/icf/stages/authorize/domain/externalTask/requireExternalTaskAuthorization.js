export function requireExternalTaskStudentAuthorization(executionState) {
  var actor = executionState.actor;
  var role = normalizeRole(actor && actor.role);

  if (!actor || !actor.id) {
    return createError("EXTERNAL_TASK_ACTOR_REQUIRED", "A signed-in student is required.");
  }

  if (role === "student" || role === "superAdmin" || role === "platformAdmin" || role === "schoolAdmin") {
    return { valid: true };
  }

  return createError("EXTERNAL_TASK_STUDENT_REQUIRED", "Only a student can submit this external task.");
}

export function requireExternalTaskReviewerAuthorization(executionState) {
  var actor = executionState.actor;
  var role = normalizeRole(actor && actor.role);

  if (!actor || !actor.id) {
    return createError("EXTERNAL_TASK_REVIEWER_REQUIRED", "A signed-in reviewer is required.");
  }

  if (role === "teacher"
      || role === "courseCreator"
      || role === "schoolAdmin"
      || role === "platformAdmin"
      || role === "superAdmin"
      || role === "admin") {
    return { valid: true };
  }

  return createError("EXTERNAL_TASK_REVIEWER_ROLE_REQUIRED", "Only teachers and admins can review external task submissions.");
}

function normalizeRole(role) {
  var normalized = typeof role === "string" ? role.replace(/^ROLE_/i, "").replace(/[^a-z0-9]/gi, "").toLowerCase() : "";

  if (normalized === "superadmin") return "superAdmin";
  if (normalized === "platformadmin") return "platformAdmin";
  if (normalized === "schooladmin") return "schoolAdmin";
  if (normalized === "coursecreator") return "courseCreator";
  return normalized;
}

function createError(code, message) {
  return {
    valid: false,
    errors: [
      {
        code: code,
        message: message
      }
    ]
  };
}
