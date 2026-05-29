export function processListSessions(executionState) {
  const context = executionState.context;

  executionState.result = readSessions(context);
  return { valid: true };
}

function readSessions(context) {
  if (!context) {
    return [];
  }

  if (!Array.isArray(context.sessions)) {
    return [];
  }

  return context.sessions;
}
