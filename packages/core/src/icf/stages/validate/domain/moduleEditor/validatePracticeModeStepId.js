import { requireStringValidation } from "../../validators.js?v=1.1.162-modal-stack";

export function validatePracticeModeStepId(executionState) {
  var payload = executionState.payload;
  return requireStringValidation(payload.stepId, "stepId");
}
