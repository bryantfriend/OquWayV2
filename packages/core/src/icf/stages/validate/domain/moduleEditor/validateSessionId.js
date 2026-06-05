import { requireStringValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";

export function validateSessionId(executionState) {
  const payload = executionState.payload;
  return requireStringValidation(payload.sessionId, "sessionId");
}
