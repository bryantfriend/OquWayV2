import { requireStringValidation } from "../../validators.js?v=1.1.110-student-class-alias-query";

export function validatePracticeModeStepId(executionState) {
  var payload = executionState.payload;
  return requireStringValidation(payload.stepId, "stepId");
}
