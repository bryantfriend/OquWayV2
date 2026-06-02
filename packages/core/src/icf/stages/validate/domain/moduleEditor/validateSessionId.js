import { requireStringValidation } from "../../validators.js?v=1.1.29-module-render-fix";

export function validateSessionId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.sessionId, "sessionId");
}
