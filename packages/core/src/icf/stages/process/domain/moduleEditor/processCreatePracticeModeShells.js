import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js";
import { normalizePracticeModes } from "./practiceModeShells.js";

export async function processCreatePracticeModeShells(executionState) {
  var payload = executionState.payload;
  var session = readSession(executionState.context);
  var practiceModes = normalizePracticeModes(session.practiceModes);

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
          code: "PRACTICE_MODE_SHELLS_WRITE_FAILED",
          message: "Failed to create practice mode shells: " + error.message
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
