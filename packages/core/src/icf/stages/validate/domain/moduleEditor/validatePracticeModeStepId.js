import { requireStringValidation } from "../../validators.js?v=1.1.63-external-task-student-feedback";

export function validatePracticeModeStepId(executionState) {
  var payload = executionState.payload;
  return requireStringValidation(payload.stepId, "stepId");
}
