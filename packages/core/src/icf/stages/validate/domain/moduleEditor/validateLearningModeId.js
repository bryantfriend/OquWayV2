import { requireStringValidation } from "../../validators.js?v=1.1.114-student-profile-rules";

export function validateLearningModeId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.modeId, "modeId");
}
