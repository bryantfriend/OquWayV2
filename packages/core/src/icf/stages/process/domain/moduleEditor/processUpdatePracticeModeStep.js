import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js";
import { updatePracticeModeStep } from "./practiceModeShells.js";

export async function processUpdatePracticeModeStep(executionState) {
  var payload = executionState.payload;
  var session = executionState.context.session;
  var stepPatch = createStepPatch(payload);
  var practiceModes = updatePracticeModeStep(session.practiceModes, payload.practiceModeKey, payload.stepId, stepPatch);

  try {
    await savePracticeModes(payload, practiceModes);
    executionState.result = Object.assign({}, session, { practiceModes: practiceModes });
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "PRACTICE_MODE_STEP_UPDATE_FAILED",
          message: "Failed to update practice mode step: " + error.message
        }
      ]
    };
  }
}

function createStepPatch(payload) {
  return {
    title: payload.title,
    instructions: payload.instructions,
    config: payload.config,
    status: payload.status
  };
}

async function savePracticeModes(payload, practiceModes) {
  await setDoc(doc(db, "courses", payload.courseId, "modules", payload.moduleId, "sessions", payload.sessionId), {
    practiceModes: practiceModes,
    updatedAt: serverTimestamp()
  }, { merge: true });
}
