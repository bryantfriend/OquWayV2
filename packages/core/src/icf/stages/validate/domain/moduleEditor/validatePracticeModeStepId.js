import { requireStringValidation } from "../../validators.js?v=1.1.78-location-command-center";

export function validatePracticeModeStepId(executionState) {
  var payload = executionState.payload;
  return requireStringValidation(payload.stepId, "stepId");
}
