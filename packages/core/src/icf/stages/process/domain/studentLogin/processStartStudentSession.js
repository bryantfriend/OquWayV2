export function processStartStudentSession(executionState) {
  executionState.result = {
    started: true,
    actorId: executionState.actor && executionState.actor.id ? executionState.actor.id : null,
    timestamp: Date.now()
  };

  return { valid: true };
}
