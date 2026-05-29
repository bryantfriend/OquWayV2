import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js";
import { createUpdatedPracticeModes } from "./practiceModeShells.js";

export async function processUpdatePracticeMode(executionState) {
  var payload = executionState.payload;
  var session = readSession(executionState.context);
  var practiceModes = createUpdatedPracticeModes(
    session.practiceModes,
    payload.practiceModeKey,
    payload
  );

  try {
    await setDoc(doc(db, "courses", payload.courseId, "modules", payload.moduleId, "sessions", payload.sessionId), {
      practiceModes: practiceModes,
      updatedAt: serverTimestamp()
    }, { merge: true });

    executionState.result = Object.assign({}, session, {
      practiceModes: practiceModes
    });

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "PRACTICE_MODE_UPDATE_FAILED",
          message: "Failed to update practice mode: " + error.message
        }
      ]
    };
  }
}

function readSession(context) {
  if (context && context.session) {
    return context.session;
  }

  return {};
}
