import { requireStringValidation } from "../../validators.js?v=1.1.117-student-identity-binding";

export function validateSessionId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.sessionId, "sessionId");
}
