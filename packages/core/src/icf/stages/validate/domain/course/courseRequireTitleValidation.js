// courseRequireTitleValidation.js

export async function courseRequireTitleValidation(executionState) {
  const { payload } = executionState;

  if (!payload || typeof payload.title !== "string") {
    return {
      valid: false,
      error: "TITLE_REQUIRED"
    };
  }

  const trimmed = payload.title.trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      error: "TITLE_EMPTY"
    };
  }

  if (trimmed.length > 120) {
    return {
      valid: false,
      error: "TITLE_TOO_LONG"
    };
  }

  return { valid: true };
}