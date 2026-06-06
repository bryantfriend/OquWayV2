import { requireStringValidation } from "../../validators.js?v=1.1.82-shared-command-center-shell";

export function validateSessionId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.sessionId, "sessionId");
}
