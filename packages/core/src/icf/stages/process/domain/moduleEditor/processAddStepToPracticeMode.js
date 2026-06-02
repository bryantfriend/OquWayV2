import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.29-module-render-fix";
import { addStepToPracticeMode } from "./practiceModeShells.js?v=1.1.29-module-render-fix";

export async function processAddStepToPracticeMode(executionState) {
  var payload = executionState.payload;
  var session = executionState.context.session;
  var step = createStep(payload);
  var practiceModes = addStepToPracticeMode(session.practiceModes, payload.practiceModeKey, step);

  try {
    await savePracticeModes(executionState, payload, practiceModes);
    executionState.result = Object.assign({}, session, { practiceModes: practiceModes });
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "PRACTICE_MODE_STEP_ADD_FAILED",
          message: "Failed to add practice mode step: " + error.message
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
    title: payload.title,
    instructions: payload.instructions,
    config: payload.config,
    order: 1,
    status: payload.status,
    createdAt: now,
    updatedAt: now
  };
}

async function savePracticeModes(executionState, payload, practiceModes) {
  await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "sessions", payload.sessionId), {
    practiceModes: practiceModes,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

function readCourseCollectionName(executionState) {
  return executionState.context && executionState.context.courseCollectionName
    ? executionState.context.courseCollectionName
    : "catalogCourses";
}

function generateId(prefix) {
  return prefix + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
}
