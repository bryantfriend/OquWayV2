export function requireUserId(executionState) {
  if (!executionState.payload.userId) {
    return createStageError("USER_ID_REQUIRED", "A user id is required.");
  }

  return { valid: true };
}

export function requireEmail(executionState) {
  if (!executionState.payload.email) {
    return createStageError("EMAIL_REQUIRED", "An email address is required.");
  }

  return { valid: true };
}

export function allowAnyPayload() {
  return { valid: true };
}

function createStageError(code, message) {
  return {
    valid: false,
    errors: [{ code: code, message: message }]
  };
}
