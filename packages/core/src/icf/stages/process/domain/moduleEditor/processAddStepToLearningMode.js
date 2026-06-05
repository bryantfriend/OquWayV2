import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.63-external-task-student-feedback";
import { addStepToPracticeMode, createDefaultPracticeModes, isValidPracticeModeKey } from "./practiceModeShells.js?v=1.1.63-external-task-student-feedback";

export async function processAddStepToLearningMode(executionState) {
  var payload = executionState.payload;
  var modeId = readModeId(executionState);
  var learningMode = readLearningMode(executionState, modeId);
  var session = findSessionForMode(executionState, learningMode);
  var practiceModeKey = readPracticeModeKey(payload, learningMode);
  var step = createStep(payload);
  var practiceModes = addStepToPracticeMode(session ? session.practiceModes : createDefaultPracticeModes(), practiceModeKey, step);
  step.order = readAddedStepOrder(practiceModes, practiceModeKey, step.id);
  var canonicalSteps = readCanonicalStepsForMode(learningMode);
  var stepOrder = canonicalSteps.map(function (existingStep) {
    return existingStep.id;
  }).filter(Boolean);
  stepOrder.push(step.id);
  var updatedSession = session || createSessionForMode(payload, learningMode, executionState.context.sessions);
  var updatedLearningMode = Object.assign({}, learningMode, {
    id: modeId,
    key: modeId,
    legacySessionId: updatedSession.id,
    stepCount: stepOrder.length,
    stepOrder: stepOrder,
    updatedAt: Date.now()
  });

  updatedSession = Object.assign({}, updatedSession, {
    learningModeId: modeId,
    learningModeType: learningMode.modeType || "custom",
    isLearningModeShell: true,
    practiceModes: practiceModes,
    updatedAt: Date.now()
  });

  try {
    await saveCanonicalStep(executionState, payload, modeId, step);
    await saveLegacySession(executionState, payload, updatedSession);
    await saveLearningModeSessionLink(executionState, payload, modeId, updatedLearningMode);

    executionState.result = {
      session: updatedSession,
      learningMode: updatedLearningMode,
      step: step,
      modeId: modeId,
      stepId: step.id
    };
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "LEARNING_MODE_STEP_ADD_FAILED",
          message: "Failed to add learning mode step: " + error.message
        }
      ]
    };
  }
}

function createStep(payload) {
  var now = Date.now();

  return {
    id: generateId("step"),
    type: payload.stepType,
    stepTypeId: payload.stepTypeId || payload.stepType,
    title: payload.title || createDefaultStepTitle(payload.stepTypeId || payload.stepType),
    instructions: payload.instructions || "",
    config: payload.config && typeof payload.config === "object" && !Array.isArray(payload.config) ? payload.config : {},
    order: 1,
    status: payload.status || "draft",
    createdAt: now,
    updatedAt: now
  };
}

function createDefaultStepTitle(stepType) {
  if (stepType === "textBriefing") {
    return { en: "Primer", ru: "", ky: "" };
  }

  return { en: "New Step", ru: "", ky: "" };
}

function findSessionForMode(executionState, learningMode) {
  var payload = executionState.payload;
  var sessions = Array.isArray(executionState.context.sessions) ? executionState.context.sessions : [];
  var index = 0;

  if (payload.sessionId) {
    while (index < sessions.length) {
      if (sessions[index].id === payload.sessionId) {
        return sessions[index];
      }
      index = index + 1;
    }
  }

  if (learningMode && learningMode.legacySessionId) {
    index = 0;
    while (index < sessions.length) {
      if (sessions[index].id === learningMode.legacySessionId) {
        return sessions[index];
      }
      index = index + 1;
    }
  }

  index = 0;
  while (index < sessions.length) {
    if (sessions[index].learningModeId === readModeId(executionState)) {
      return sessions[index];
    }
    index = index + 1;
  }

  return null;
}

function createSessionForMode(payload, learningMode, sessions) {
  var now = Date.now();
  var order = Array.isArray(sessions) ? sessions.length + 1 : 1;
  var modeId = learningMode.id || payload.modeId || "primary";

  return {
    id: "mode-" + modeId + "-" + now.toString(36),
    title: { en: readText(learningMode.title, "Learning Mode"), ru: "", ky: "" },
    description: learningMode.purpose || "",
    sessionNumber: order,
    order: order,
    status: "draft",
    learningModeId: modeId,
    learningModeType: learningMode.modeType || "custom",
    isLearningModeShell: true,
    practiceModes: createDefaultPracticeModes(),
    createdAt: now,
    updatedAt: now
  };
}

async function saveCanonicalStep(executionState, payload, modeId, step) {
  await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "learningModes", modeId, "steps", step.id), step, { merge: true });
}

async function saveLegacySession(executionState, payload, session) {
  await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "sessions", session.id), Object.assign({}, session, {
    updatedAt: serverTimestamp()
  }), { merge: true });
}

async function saveLearningModeSessionLink(executionState, payload, modeId, learningMode) {
  await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "learningModes", modeId), Object.assign({}, learningMode, {
    updatedAt: serverTimestamp()
  }), { merge: true });

  await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId), {
    learningModes: {
      [modeId]: learningMode
    },
    stepCount: readUpdatedModuleStepCount(executionState, modeId, learningMode.stepCount),
    updatedAt: serverTimestamp()
  }, { merge: true });
}

function readUpdatedModuleStepCount(executionState, updatedModeId, updatedModeStepCount) {
  var module = executionState.context.module || {};
  var modes = module.learningModes && typeof module.learningModes === "object" ? module.learningModes : {};
  var modeIds = Object.keys(modes);
  var total = 0;
  var index = 0;

  while (index < modeIds.length) {
    if (modeIds[index] === updatedModeId) {
      total = total + readNumber(updatedModeStepCount, 0);
    } else {
      total = total + readNumber(modes[modeIds[index]].stepCount, 0);
    }

    index = index + 1;
  }

  if (modeIds.indexOf(updatedModeId) === -1) {
    total = total + readNumber(updatedModeStepCount, 0);
  }

  return total;
}

function readModeId(executionState) {
  var payload = executionState.payload || {};
  var session = executionState.context.session || null;

  if (payload.modeId) {
    return payload.modeId;
  }

  if (session && session.learningModeId) {
    return session.learningModeId;
  }

  return readModeIdByLegacySessionId(executionState) || "primary";
}

function readLearningMode(executionState, modeId) {
  if (executionState.context.learningMode) {
    return executionState.context.learningMode;
  }

  var module = executionState.context.module || {};
  var modes = module.learningModes && typeof module.learningModes === "object" ? module.learningModes : {};

  if (modes[modeId]) {
    return Object.assign({ id: modeId }, modes[modeId]);
  }

  return {
    id: modeId,
    key: modeId,
    title: modeId === "primary" ? "Primary Mode" : "Learning Mode",
    purpose: "",
    modeType: modeId === "primary" ? "primary" : "custom",
    status: "draft",
    order: 99,
    required: modeId === "primary"
  };
}

function readModeIdByLegacySessionId(executionState) {
  var payload = executionState.payload || {};
  var module = executionState.context.module || {};
  var modes = module.learningModes && typeof module.learningModes === "object" ? module.learningModes : {};
  var modeIds = Object.keys(modes);
  var index = 0;

  while (index < modeIds.length) {
    if (modes[modeIds[index]] && modes[modeIds[index]].legacySessionId === payload.sessionId) {
      return modeIds[index];
    }
    index = index + 1;
  }

  return "";
}

function readPracticeModeKey(payload, learningMode) {
  if (payload.practiceModeKey && isValidPracticeModeKey(payload.practiceModeKey)) {
    return payload.practiceModeKey;
  }

  if (learningMode && learningMode.modeType === "review") {
    return "afterClass";
  }

  if (learningMode && learningMode.modeType === "practice") {
    return "dailyPractice";
  }

  if (learningMode && learningMode.modeType === "assessment") {
    return "classroomLesson";
  }

  return "beforeClass";
}

function readAddedStepOrder(practiceModes, practiceModeKey, stepId) {
  var practiceMode = practiceModes && practiceModes[practiceModeKey] ? practiceModes[practiceModeKey] : null;
  var steps = practiceMode && Array.isArray(practiceMode.steps) ? practiceMode.steps : [];
  var index = 0;

  while (index < steps.length) {
    if (steps[index].id === stepId) {
      return steps[index].order || index + 1;
    }
    index = index + 1;
  }

  return steps.length + 1;
}

function readCanonicalStepsForMode(learningMode) {
  if (!learningMode || !Array.isArray(learningMode.steps)) {
    return [];
  }

  return learningMode.steps;
}

function readText(value, fallbackText) {
  if (typeof value === "string") {
    return value.trim() || fallbackText;
  }

  if (value && typeof value === "object") {
    return value.en || value.ru || value.ky || fallbackText;
  }

  return fallbackText;
}

function readNumber(value, fallbackValue) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallbackValue;
}

function readCourseCollectionName(executionState) {
  return executionState.context && executionState.context.courseCollectionName
    ? executionState.context.courseCollectionName
    : "catalogCourses";
}

function generateId(prefix) {
  return prefix + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
}
