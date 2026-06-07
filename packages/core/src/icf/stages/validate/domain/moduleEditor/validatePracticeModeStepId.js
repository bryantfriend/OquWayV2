import { requireStringValidation } from "../../validators.js?v=1.1.114-student-profile-rules";

export function validatePracticeModeStepId(executionState) {
  var payload = executionState.payload;
  return requireStringValidation(payload.stepId, "stepId");
}
