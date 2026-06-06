import { canManageUsers, canReviewExternalTask, canSubmitExternalTask, canViewStudentProgress } from "./policies.js?v=1.1.79-user-command-center";

export function requireCanManageUsers(userProfile) {
  return createGuardResult(canManageUsers(userProfile), "MANAGE_USERS_REQUIRED", "User management access is required.");
}

export function requireCanReviewExternalTask(userProfile) {
  return createGuardResult(canReviewExternalTask(userProfile), "REVIEW_EXTERNAL_TASK_REQUIRED", "External Task review access is required.");
}

export function requireCanSubmitExternalTask(userProfile) {
  return createGuardResult(canSubmitExternalTask(userProfile), "SUBMIT_EXTERNAL_TASK_REQUIRED", "External Task submission access is required.");
}

export function requireCanViewStudentProgress(userProfile, studentProfile) {
  return createGuardResult(canViewStudentProgress(userProfile, studentProfile), "VIEW_STUDENT_PROGRESS_REQUIRED", "Student progress access is required.");
}

function createGuardResult(allowed, code, message) {
  if (allowed) {
    return { valid: true };
  }

  return {
    valid: false,
    errors: [{ code: code, message: message }]
  };
}
