import { requireStringValidation } from "../../validators.js?v=1.1.110-student-class-alias-query";

export function validateLearningModeId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.modeId, "modeId");
}
