import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js";
import { deletePracticeModeStep } from "./practiceModeShells.js";

export async function processDeletePracticeModeStep(executionState) {
  var payload = executionState.payload;
  var session = executionState.context.session;
  var practiceModes = deletePracticeModeStep(session.practiceModes, payload.practiceModeKey, payload.stepId);

  try {
    await setDoc(doc(db, "courses", payload.courseId, "modules", payload.moduleId, "sessions", payload.sessionId), {
      practiceModes: practiceModes,
      updatedAt: serverTimestamp()
    }, { merge: true });

    executionState.result = Object.assign({}, session, { practiceModes: practiceModes });
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "PRACTICE_MODE_STEP_DELETE_FAILED",
          message: "Failed to delete practice mode step: " + error.message
        }
      ]
    };
  }
}
