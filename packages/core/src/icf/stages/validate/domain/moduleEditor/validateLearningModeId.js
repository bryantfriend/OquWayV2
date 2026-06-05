import { requireStringValidation } from "../../validators.js?v=1.1.63-external-task-student-feedback";

export function validateLearningModeId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.modeId, "modeId");
}
