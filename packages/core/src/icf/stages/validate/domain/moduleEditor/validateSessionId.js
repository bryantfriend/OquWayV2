import { requireStringValidation } from "../../validators.js?v=1.1.120-student-course-debug-summary";

export function validateSessionId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.sessionId, "sessionId");
}
