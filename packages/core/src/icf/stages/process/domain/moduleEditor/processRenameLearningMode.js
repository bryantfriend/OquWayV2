import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.113-student-rules-read";
import { createDefaultLearningModes } from "./learningArchitecture.js?v=1.1.113-student-rules-read";

export async function processRenameLearningMode(executionState) {
  var payload = executionState.payload || {};
  var modeId = payload.modeId;
  var modes = createDefaultLearningModes(executionState.context.module.learningModes, executionState.context.sessions);
  var mode = modes[modeId];

  if (!mode) {
    return {
      valid: false,
      errors: [{ code: "LEARNING_MODE_NOT_FOUND", message: "Learning mode not found." }]
    };
  }

  mode = Object.assign({}, mode, {
    title: readText(payload.title, mode.title),
    purpose: readText(payload.purpose, mode.purpose),
    updatedAt: Date.now()
  });
  modes[modeId] = mode;

  try {
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "learningModes", modeId), mode, { merge: true });
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId), {
      learningModes: modes,
      updatedAt: serverTimestamp()
    }, { merge: true });

    executionState.result = { learningModes: modes, learningMode: mode };
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [{ code: "LEARNING_MODE_RENAME_FAILED", message: "Failed to rename learning mode: " + error.message }]
    };
  }
}

function readText(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function readCourseCollectionName(executionState) {
  return executionState.context && executionState.context.courseCollectionName
    ? executionState.context.courseCollectionName
    : "catalogCourses";
}
