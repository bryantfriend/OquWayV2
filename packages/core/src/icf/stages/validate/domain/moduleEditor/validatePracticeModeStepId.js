import { requireStringValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";

export function validatePracticeModeStepId(executionState) {
  var payload = executionState.payload;
  return requireStringValidation(payload.stepId, "stepId");
}
