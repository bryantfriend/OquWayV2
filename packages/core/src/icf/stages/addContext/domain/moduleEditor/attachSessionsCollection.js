import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.111-student-assignment-debug-panel";
import { normalizePracticeModes } from "../../../process/domain/moduleEditor/practiceModeShells.js?v=1.1.111-student-assignment-debug-panel";

export async function attachSessionsCollection(executionState) {
  const payload = executionState.payload;

  if (!payload.courseId || !payload.moduleId) {
    return { valid: true };
  }

  try {
    const sessionsRef = collection(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "sessions");
    const snapshot = await getDocs(sessionsRef);
    const sessions = [];
    const canonicalModes = await readCanonicalLearningModes(executionState, payload.courseId, payload.moduleId);

    snapshot.forEach(function (documentSnapshot) {
      sessions.push(normalizeSessionDocument(documentSnapshot.id, documentSnapshot.data()));
    });

    hydrateSessionsFromCanonicalSteps(sessions, canonicalModes);
    sessions.sort(compareSessionOrder);

    return {
      valid: true,
      data: {
        sessions: sessions,
        canonicalLearningModes: createLearningModesMap(canonicalModes)
      }
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "SESSIONS_READ_FAILED",
          message: "Failed to attach sessions collection: " + error.message
        }
      ]
    };
  }
}

async function readCanonicalLearningModes(executionState, courseId, moduleId) {
  const collectionName = readCourseCollectionName(executionState);
  const modesRef = collection(db, collectionName, courseId, "modules", moduleId, "learningModes");
  const modeSnapshot = await getDocs(modesRef);
  const modes = [];

  for (const modeDoc of modeSnapshot.docs) {
    const mode = Object.assign({ id: modeDoc.id }, modeDoc.data() || {});
    mode.steps = await readCanonicalSteps(collectionName, courseId, moduleId, modeDoc.id);
    mode.stepCount = mode.steps.length;
    mode.stepOrder = mode.steps.map(function (step) {
      return step.id;
    });
    modes.push(mode);
  }

  return modes;
}

async function readCanonicalSteps(collectionName, courseId, moduleId, modeId) {
  const stepsRef = collection(db, collectionName, courseId, "modules", moduleId, "learningModes", modeId, "steps");
  const stepSnapshot = await getDocs(stepsRef);
  const steps = [];

  stepSnapshot.forEach(function (stepDoc) {
    steps.push(Object.assign({ id: stepDoc.id }, stepDoc.data() || {}));
  });

  steps.sort(function (firstStep, secondStep) {
    return readOrder(firstStep) - readOrder(secondStep);
  });

  return steps;
}

function hydrateSessionsFromCanonicalSteps(sessions, canonicalModes) {
  let modeIndex = 0;

  while (modeIndex < canonicalModes.length) {
    const mode = canonicalModes[modeIndex];
    const session = findOrCreateSessionForMode(sessions, mode);
    const practiceModeKey = readPracticeModeKeyForLearningMode(mode);
    const practiceModes = normalizePracticeModes(session.practiceModes);

    practiceModes[practiceModeKey].steps = Array.isArray(mode.steps) ? mode.steps.slice() : [];
    practiceModes[practiceModeKey].status = practiceModes[practiceModeKey].steps.length > 0 ? "draft" : practiceModes[practiceModeKey].status;
    session.practiceModes = practiceModes;
    session.learningModeId = mode.id;
    session.learningModeType = mode.modeType || session.learningModeType || "custom";
    session.isLearningModeShell = true;
    modeIndex = modeIndex + 1;
  }
}

function findOrCreateSessionForMode(sessions, mode) {
  let index = 0;

  while (index < sessions.length) {
    if ((mode.legacySessionId && sessions[index].id === mode.legacySessionId) || sessions[index].learningModeId === mode.id) {
      return sessions[index];
    }

    index = index + 1;
  }

  const session = {
    id: mode.legacySessionId || "mode-" + mode.id + "-canonical",
    title: { en: readText(mode.title, "Learning Mode"), ru: "", ky: "" },
    description: mode.purpose || "",
    sessionNumber: sessions.length + 1,
    order: mode.order || sessions.length + 1,
    status: mode.status || "draft",
    learningModeId: mode.id,
    learningModeType: mode.modeType || "custom",
    isLearningModeShell: true,
    practiceModes: normalizePracticeModes({})
  };

  sessions.push(session);
  return session;
}

function createLearningModesMap(canonicalModes) {
  const modes = {};
  let index = 0;

  while (index < canonicalModes.length) {
    const mode = canonicalModes[index];
    modes[mode.id] = Object.assign({}, mode);
    index = index + 1;
  }

  return modes;
}

function readPracticeModeKeyForLearningMode(mode) {
  if (mode && mode.modeType === "review") {
    return "afterClass";
  }

  if (mode && mode.modeType === "practice") {
    return "dailyPractice";
  }

  if (mode && mode.modeType === "assessment") {
    return "classroomLesson";
  }

  return "beforeClass";
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

function readCourseCollectionName(executionState) {
  if (executionState.context && executionState.context.courseCollectionName) {
    return executionState.context.courseCollectionName;
  }

  return "catalogCourses";
}

function normalizeSessionDocument(sessionId, sessionData) {
  var session = Object.assign({ id: sessionId }, sessionData);
  session.practiceModes = normalizePracticeModes(session.practiceModes);
  return session;
}

function compareSessionOrder(firstSession, secondSession) {
  return readOrder(firstSession) - readOrder(secondSession);
}

function readOrder(session) {
  if (session && typeof session.order === "number") {
    return session.order;
  }

  return 0;
}
