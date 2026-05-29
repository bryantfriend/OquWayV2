import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js";
import { addStepToPracticeMode } from "./practiceModeShells.js";

export async function processAddStepToPracticeMode(executionState) {
  var payload = executionState.payload;
  var session = executionState.context.session;
  var step = createStep(payload);
  var practiceModes = addStepToPracticeMode(session.practiceModes, payload.practiceModeKey, step);

  try {
    await savePracticeModes(payload, practiceModes);
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

async function savePracticeModes(payload, practiceModes) {
  await setDoc(doc(db, "courses", payload.courseId, "modules", payload.moduleId, "sessions", payload.sessionId), {
    practiceModes: practiceModes,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

function generateId(prefix) {
  return prefix + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
}
