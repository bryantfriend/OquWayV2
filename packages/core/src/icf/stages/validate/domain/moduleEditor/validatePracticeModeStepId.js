import { requireStringValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";

export function validatePracticeModeStepId(executionState) {
  var payload = executionState.payload;
  return requireStringValidation(payload.stepId, "stepId");
}
