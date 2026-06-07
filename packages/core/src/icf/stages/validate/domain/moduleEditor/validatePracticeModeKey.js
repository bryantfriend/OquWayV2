import { isValidPracticeModeKey } from "../../../process/domain/moduleEditor/practiceModeShells.js?v=1.1.118-fruit-login-student-identity";

export function validatePracticeModeKey(executionState) {
  var payload = executionState.payload;

  if (!payload.practiceModeKey || typeof payload.practiceModeKey !== "string") {
    return {
      valid: false,
      errors: [
        {
          code: "PRACTICE_MODE_KEY_REQUIRED",
          field: "practiceModeKey",
          message: "Practice mode key is required."
        }
      ]
    };
  }

  if (!isValidPracticeModeKey(payload.practiceModeKey)) {
    return {
      valid: false,
      errors: [
        {
          code: "PRACTICE_MODE_KEY_INVALID",
          field: "practiceModeKey",
          message: "Invalid practice mode key: " + payload.practiceModeKey
        }
      ]
    };
  }

  return { valid: true };
}
