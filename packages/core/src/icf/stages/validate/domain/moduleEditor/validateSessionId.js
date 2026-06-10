import { requireStringValidation } from "../../validators.js?v=1.1.162-modal-stack";

export function validateSessionId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.sessionId, "sessionId");
}
