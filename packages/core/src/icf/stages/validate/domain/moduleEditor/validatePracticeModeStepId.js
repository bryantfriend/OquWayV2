import { requireStringValidation } from "../../validators.js?v=1.1.109-student-assignment-status-fallback";

export function validatePracticeModeStepId(executionState) {
  var payload = executionState.payload;
  return requireStringValidation(payload.stepId, "stepId");
}
