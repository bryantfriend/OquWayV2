import { requireStringValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";

export function validateLearningModeId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.modeId, "modeId");
}
