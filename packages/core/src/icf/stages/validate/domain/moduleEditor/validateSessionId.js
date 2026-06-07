import { requireStringValidation } from "../../validators.js?v=1.1.111-student-assignment-debug-panel";

export function validateSessionId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.sessionId, "sessionId");
}
