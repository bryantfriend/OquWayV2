import { requireStringValidation } from "../../validators.js?v=1.1.114-student-profile-rules";

export function validateSessionId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.sessionId, "sessionId");
}
