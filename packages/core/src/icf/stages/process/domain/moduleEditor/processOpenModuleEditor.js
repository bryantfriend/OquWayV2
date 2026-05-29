export async function processOpenModuleEditor(executionState) {
  const context = executionState.context;

  executionState.result = {
    course: context.course,
    module: context.module,
    sessions: readSessions(context.sessions),
    selectedSessionId: readSelectedSessionId(context.sessions),
    steps: readSteps(context.steps),
    selectedStepId: readSelectedStepId(context.steps),
    permissions: {
      role: context.actorRole,
      canEdit: true
    }
  };

  return { valid: true };
}

function readSessions(sessions) {
  if (!Array.isArray(sessions)) {
    return [];
  }

  return sessions;
}

function readSteps(steps) {
  if (!Array.isArray(steps)) {
    return [];
  }

  return steps;
}

function readSelectedSessionId(sessions) {
  if (Array.isArray(sessions) && sessions.length > 0) {
    return sessions[0].id;
  }

  return null;
}

function readSelectedStepId(steps) {
  if (Array.isArray(steps) && steps.length > 0) {
    return steps[0].id;
  }

  return null;
}
