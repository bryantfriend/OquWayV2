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

export function requireUserCreatePayload(executionState) {
  var payload = executionState.payload || {};

  if (!payload.displayName && !payload.name) {
    return createStageError("DISPLAY_NAME_REQUIRED", "Display name is required.");
  }

  if (!payload.email) {
    return createStageError("EMAIL_REQUIRED", "An email address is required.");
  }

  if (!Array.isArray(payload.roles) || payload.roles.length === 0) {
    return createStageError("ROLES_REQUIRED", "At least one initial role is required.");
  }

  return { valid: true };
}

function createStageError(code, message) {
  return {
    valid: false,
    errors: [{ code: code, message: message }]
  };
}
