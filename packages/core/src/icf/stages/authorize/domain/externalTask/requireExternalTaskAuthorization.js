import { canReviewExternalTask, canSubmitExternalTask } from "../../../../../../../permissions/index.js?v=1.1.116-student-token-ready";

export function requireExternalTaskStudentAuthorization(executionState) {
  var actor = executionState.actor;

  if (!actor || !actor.id) {
    return createError("EXTERNAL_TASK_ACTOR_REQUIRED", "A signed-in student is required.");
  }

  if (canSubmitExternalTask(actor)) {
    return { valid: true };
  }

  return createError("EXTERNAL_TASK_STUDENT_REQUIRED", "Only a student can submit this external task.");
}

export function requireExternalTaskReviewerAuthorization(executionState) {
  var actor = executionState.actor;

  if (!actor || !actor.id) {
    return createError("EXTERNAL_TASK_REVIEWER_REQUIRED", "A signed-in reviewer is required.");
  }

  if (canReviewExternalTask(actor)) {
    return { valid: true };
  }

  return createError("EXTERNAL_TASK_REVIEWER_ROLE_REQUIRED", "Only teachers and admins can review external task submissions.");
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
