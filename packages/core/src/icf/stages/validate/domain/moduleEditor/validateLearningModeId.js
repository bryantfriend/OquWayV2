import { requireStringValidation } from "../../validators.js?v=1.1.124-location-icon-upload";

export function validateLearningModeId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.modeId, "modeId");
}
