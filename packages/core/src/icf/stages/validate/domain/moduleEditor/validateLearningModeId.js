import { requireStringValidation } from "../../validators.js?v=1.1.117-student-identity-binding";

export function validateLearningModeId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.modeId, "modeId");
}
