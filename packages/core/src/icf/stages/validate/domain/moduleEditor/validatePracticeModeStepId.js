import { requireStringValidation } from "../../validators.js?v=1.1.121-student-dashboard-open-clean";

export function validatePracticeModeStepId(executionState) {
  var payload = executionState.payload;
  return requireStringValidation(payload.stepId, "stepId");
}
