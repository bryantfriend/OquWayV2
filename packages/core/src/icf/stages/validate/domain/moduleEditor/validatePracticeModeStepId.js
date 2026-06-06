import { requireStringValidation } from "../../validators.js?v=1.1.107-student-firebase-auth-chain";

export function validatePracticeModeStepId(executionState) {
  var payload = executionState.payload;
  return requireStringValidation(payload.stepId, "stepId");
}
