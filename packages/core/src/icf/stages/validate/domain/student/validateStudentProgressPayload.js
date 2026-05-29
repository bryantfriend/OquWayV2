import { requireStringValidation } from "../../validators.js";

export function validateStudentProgressPayload(executionState) {
  var payload = executionState.payload;
  var courseResult = requireStringValidation(payload.courseId, "courseId");
  var moduleResult = requireStringValidation(payload.moduleId, "moduleId");
  var sessionResult = requireStringValidation(payload.sessionId, "sessionId");
  var errors = [];

  appendErrors(errors, courseResult);
  appendErrors(errors, moduleResult);
  appendErrors(errors, sessionResult);

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors
    };
  }

  return { valid: true };
}

function appendErrors(errors, result) {
  var errorIndex = 0;

  if (!result || result.valid !== false || !Array.isArray(result.errors)) {
    return;
  }

  while (errorIndex < result.errors.length) {
    errors.push(result.errors[errorIndex]);
    errorIndex = errorIndex + 1;
  }
}
