import { requireStringValidation } from "../../validators.js?v=1.1.113-student-rules-read";

export function validateLearningModeId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.modeId, "modeId");
}
