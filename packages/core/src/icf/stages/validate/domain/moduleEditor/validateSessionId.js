import { requireStringValidation } from "../../validators.js?v=1.1.78-location-command-center";

export function validateSessionId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.sessionId, "sessionId");
}
