import { requireStringValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";

export function validateLearningModeId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.modeId, "modeId");
}
