import { createDefaultLearningContent, createDefaultLearningModes } from "./learningArchitecture.js?v=1.1.112-student-assignment-error-debug";

export async function processOpenModuleEditor(executionState) {
  const context = executionState.context;
  const moduleRecord = createModuleWithCanonicalModes(context.module, context.canonicalLearningModes);
  const learningModes = createDefaultLearningModes(moduleRecord && moduleRecord.learningModes, context.sessions);
  const selectedModeId = readSelectedLearningModeId(learningModes);

  executionState.result = {
    course: context.course,
    module: moduleRecord,
    learningContent: createDefaultLearningContent(moduleRecord && moduleRecord.learningContent),
    learningModes: learningModes,
    selectedModeId: selectedModeId,
    selectedLearningModeId: selectedModeId,
    sessions: readSessions(context.sessions),
    selectedSessionId: readSelectedSessionId(context.sessions, learningModes, selectedModeId),
    steps: readSteps(context.steps),
    selectedStepId: readSelectedStepId(context.steps),
    permissions: {
      role: context.actorRole,
      canEdit: true
    }
  };

  return { valid: true };
}

function createModuleWithCanonicalModes(moduleRecord, canonicalLearningModes) {
  const safeModule = moduleRecord && typeof moduleRecord === "object" ? moduleRecord : {};
  const moduleModes = safeModule.learningModes && typeof safeModule.learningModes === "object" ? safeModule.learningModes : {};
  const canonicalModes = canonicalLearningModes && typeof canonicalLearningModes === "object" ? canonicalLearningModes : {};

  return Object.assign({}, safeModule, {
    learningModes: Object.assign({}, moduleModes, canonicalModes)
  });
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

function readSelectedSessionId(sessions, learningModes, selectedModeId) {
  var safeSessions = Array.isArray(sessions) ? sessions : [];
  var selectedMode = learningModes && selectedModeId ? learningModes[selectedModeId] : null;
  var index = 0;

  if (selectedMode && selectedMode.legacySessionId) {
    while (index < safeSessions.length) {
      if (safeSessions[index].id === selectedMode.legacySessionId) {
        return safeSessions[index].id;
      }
      index = index + 1;
    }
  }

  index = 0;
  while (index < safeSessions.length) {
    if (safeSessions[index].learningModeId === selectedModeId) {
      return safeSessions[index].id;
    }
    index = index + 1;
  }

  if (selectedModeId === "primary" && safeSessions.length > 0) {
    return safeSessions[0].id;
  }

  return null;
}

function readSelectedStepId(steps) {
  if (Array.isArray(steps) && steps.length > 0) {
    return steps[0].id;
  }

  return null;
}

function readSelectedLearningModeId(learningModes) {
  if (learningModes && learningModes.primary) {
    return "primary";
  }

  var keys = Object.keys(learningModes || {});
  if (keys.length > 0) {
    return keys[0];
  }

  return null;
}
