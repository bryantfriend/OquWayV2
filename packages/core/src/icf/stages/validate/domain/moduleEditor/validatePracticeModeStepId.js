import { requireStringValidation } from "../../validators.js?v=1.1.79-user-command-center";

export function validatePracticeModeStepId(executionState) {
  var payload = executionState.payload;
  return requireStringValidation(payload.stepId, "stepId");
}
