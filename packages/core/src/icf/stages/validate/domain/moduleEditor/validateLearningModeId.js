import { requireStringValidation } from "../../validators.js?v=1.1.78-location-command-center";

export function validateLearningModeId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.modeId, "modeId");
}
