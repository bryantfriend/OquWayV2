import { requireStringValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";

export function validateLearningModeId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.modeId, "modeId");
}
