import { requireStringValidation } from "../../validators.js?v=1.1.118-fruit-login-student-identity";

export function validatePracticeModeStepId(executionState) {
  var payload = executionState.payload;
  return requireStringValidation(payload.stepId, "stepId");
}
