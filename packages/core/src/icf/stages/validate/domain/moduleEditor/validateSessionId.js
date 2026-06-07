import { requireStringValidation } from "../../validators.js?v=1.1.121-student-dashboard-open-clean";

export function validateSessionId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.sessionId, "sessionId");
}
