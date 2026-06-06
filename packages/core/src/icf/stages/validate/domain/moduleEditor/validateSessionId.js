import { requireStringValidation } from "../../validators.js?v=1.1.79-user-command-center";

export function validateSessionId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.sessionId, "sessionId");
}
