import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.79-user-command-center";
import { createDefaultPracticeModes } from "./practiceModeShells.js?v=1.1.79-user-command-center";
import { createDefaultLearningModes, createLearningModeRecord, createModeFromPayload } from "./learningArchitecture.js?v=1.1.79-user-command-center";

export async function processCreateLearningMode(executionState) {
  var payload = executionState.payload;
  var modes = createDefaultLearningModes(executionState.context.module.learningModes, executionState.context.sessions);
  var mode = createModeFromPayload(payload, modes);
  var sessionId = "mode-" + mode.id + "-" + Date.now().toString(36);
  var sessionRecord = createLegacySessionForMode(sessionId, mode, executionState.context.sessions);

  mode.legacySessionId = sessionId;
  modes[mode.id] = mode;

  try {
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "sessions", sessionId), sessionRecord);
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "learningModes", mode.id), mode, { merge: true });
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId), {
      learningModes: modes,
      updatedAt: serverTimestamp()
    }, { merge: true });

    executionState.result = { learningModes: modes, learningMode: mode, session: sessionRecord };
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [{ code: "LEARNING_MODE_CREATE_FAILED", message: "Failed to create learning mode: " + error.message }]
    };
  }
}

function createLegacySessionForMode(sessionId, mode, sessions) {
  var order = Array.isArray(sessions) ? sessions.length + 1 : mode.order;
  return {
    id: sessionId,
    title: { en: mode.title, ru: "", ky: "" },
    description: mode.purpose,
    sessionNumber: order,
    order: order,
    status: "draft",
    learningModeId: mode.id,
    learningModeType: mode.modeType,
    isLearningModeShell: true,
    practiceModes: createDefaultPracticeModes(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

function readCourseCollectionName(executionState) {
  return executionState.context && executionState.context.courseCollectionName
    ? executionState.context.courseCollectionName
    : "catalogCourses";
}
