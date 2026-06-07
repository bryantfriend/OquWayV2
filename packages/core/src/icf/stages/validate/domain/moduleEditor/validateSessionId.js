import { requireStringValidation } from "../../validators.js?v=1.1.118-fruit-login-student-identity";

export function validateSessionId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.sessionId, "sessionId");
}
