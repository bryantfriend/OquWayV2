import { requireStringValidation } from "../../validators.js?v=1.1.120-student-course-debug-summary";

export function validatePracticeModeStepId(executionState) {
  var payload = executionState.payload;
  return requireStringValidation(payload.stepId, "stepId");
}
