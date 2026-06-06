import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.107-student-firebase-auth-chain";
import { createDefaultLearningModes, createLearningModeRecord, generateLearningModeId } from "./learningArchitecture.js?v=1.1.107-student-firebase-auth-chain";

export async function processDuplicateLearningMode(executionState) {
  var payload = executionState.payload;
  var modes = createDefaultLearningModes(executionState.context.module.learningModes, executionState.context.sessions);
  var sourceMode = modes[payload.modeId];

  if (!sourceMode) {
    return { valid: false, errors: [{ code: "LEARNING_MODE_NOT_FOUND", message: "Learning mode not found." }] };
  }

  var sourceSession = findSessionById(executionState.context.sessions, sourceMode.legacySessionId);
  var modeId = generateLearningModeId(sourceMode.modeType || "mode");
  var sessionId = "mode-" + modeId + "-" + Date.now().toString(36);
  var mode = createLearningModeRecord({
    modeId: modeId,
    title: (payload.title || sourceMode.title + " Copy"),
    purpose: sourceMode.purpose,
    modeType: sourceMode.modeType,
    order: Object.keys(modes).length + 1,
    required: false,
    legacySessionId: sessionId,
    generated: true,
    generatedFrom: sourceMode.id
  });
  var sessionRecord = cloneSessionForMode(sessionId, mode, sourceSession, executionState.context.sessions);

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
      errors: [{ code: "LEARNING_MODE_DUPLICATE_FAILED", message: "Failed to duplicate learning mode: " + error.message }]
    };
  }
}

function cloneSessionForMode(sessionId, mode, sourceSession, sessions) {
  var order = Array.isArray(sessions) ? sessions.length + 1 : mode.order;
  var source = sourceSession || {};
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
    generated: true,
    generatedFrom: mode.generatedFrom,
    practiceModes: cloneJson(source.practiceModes || {}),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

function findSessionById(sessions, sessionId) {
  if (!Array.isArray(sessions)) return null;
  return sessions.find(function (session) { return session.id === sessionId; }) || null;
}

function cloneJson(value) {
  try {
    return JSON.parse(JSON.stringify(value || {}));
  } catch (error) {
    return {};
  }
}

function readCourseCollectionName(executionState) {
  return executionState.context && executionState.context.courseCollectionName
    ? executionState.context.courseCollectionName
    : "catalogCourses";
}
