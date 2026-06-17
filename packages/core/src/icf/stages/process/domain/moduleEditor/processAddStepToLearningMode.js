import { collection, db, doc, getDocs, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.192-timed-sequence";
import { addStepToPracticeMode, createDefaultPracticeModes, isValidPracticeModeKey } from "./practiceModeShells.js?v=1.1.192-timed-sequence";
import { normalizeActivityTemplateId } from "../../../../../shared/stepTypes/stepTypeRegistry.js?v=1.1.192-timed-sequence";
import { countModuleSteps as countSharedModuleSteps } from "../../../../../../../domain/progress/index.js";

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
  var stepType = payload.stepTypeId || payload.stepType;

  return {
    id: generateId("step"),
    type: payload.stepType,
    stepTypeId: stepType,
    title: payload.title || createDefaultStepTitle(stepType),
    instructions: payload.instructions || "",
    config: payload.config && typeof payload.config === "object" && !Array.isArray(payload.config) ? payload.config : {},
    activityTemplate: normalizeActivityTemplateId(stepType, payload.activityTemplate),
    order: 1,
    status: payload.status || "draft",
    createdAt: now,
    updatedAt: now
  };
}

function createDefaultStepTitle(stepType) {
  var titles = {
    "intro-card": "Intro Card",
    "card-reveal": "Card Reveal",
    sorting: "Sorting",
    "multiple-choice": "Multiple Choice",
    "multi-select": "Multi Select",
    "scenario-choice": "Scenario Choice",
    "scenario-simulator": "Scenario Simulator",
    "sequence-memory": "Sequence Memory",
    "timed-sequence": "Timed Sequence Challenge",
    "practice-challenge": "Competitive Collector",
    "creative-canvas": "Creative Canvas",
    roadmap: "Roadmap",
    matching: "Matching",
    ordering: "Ordering",
    reflection: "Reflection"
  };

  if (titles[stepType]) {
    return { en: titles[stepType], ru: "", ky: "" };
  }

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
  var moduleStepCount = readUpdatedModuleStepCount(executionState, modeId, learningMode.stepCount);
  var courseStepCount = await readUpdatedCourseStepCount(readCourseCollectionName(executionState), payload.courseId, payload.moduleId, moduleStepCount, executionState.context.module);

  await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "learningModes", modeId), Object.assign({}, learningMode, {
    updatedAt: serverTimestamp()
  }), { merge: true });

  await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId), {
    learningModes: {
      [modeId]: learningMode
    },
    stepCount: moduleStepCount,
    stepsInitialized: true,
    updatedAt: serverTimestamp()
  }, { merge: true });

  await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId), {
    stepCount: courseStepCount,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

function readUpdatedModuleStepCount(executionState, updatedModeId, updatedModeStepCount) {
  var module = executionState.context.module || {};
  var modes = module.learningModes && typeof module.learningModes === "object" ? module.learningModes : {};
  var nextModes = Object.assign({}, modes, {
    [updatedModeId]: Object.assign({}, modes[updatedModeId] || {}, {
      stepCount: readNumber(updatedModeStepCount, 0)
    })
  });

  return countSharedModuleSteps(Object.assign({}, module, {
    learningModes: nextModes
  }));
}

async function readUpdatedCourseStepCount(collectionName, courseId, updatedModuleId, updatedModuleStepCount, currentModule) {
  var modulesSnapshot = await getDocs(collection(db, collectionName, courseId, "modules"));
  var total = 0;
  var sawUpdatedModule = false;

  modulesSnapshot.forEach(function (moduleDoc) {
    if (moduleDoc.id === updatedModuleId) {
      total = total + readNumber(updatedModuleStepCount, 0);
      sawUpdatedModule = true;
      return;
    }

    total = total + countSharedModuleSteps(moduleDoc.data() || {});
  });

  if (!sawUpdatedModule) {
    total = total + readNumber(updatedModuleStepCount, countSharedModuleSteps(currentModule));
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
