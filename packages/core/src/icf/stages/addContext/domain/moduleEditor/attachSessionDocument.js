import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js";
import { normalizePracticeModes } from "../../../process/domain/moduleEditor/practiceModeShells.js";

export async function attachSessionDocument(executionState) {
  var payload = executionState.payload;

  if (!payload.courseId || !payload.moduleId || !payload.sessionId) {
    return { valid: true };
  }

  try {
    var docRef = doc(db, "courses", payload.courseId, "modules", payload.moduleId, "sessions", payload.sessionId);
    var docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        valid: false,
        errors: [
          {
            code: "SESSION_NOT_FOUND",
            message: "Session not found: " + payload.sessionId
          }
        ]
      };
    }

    return {
      valid: true,
      data: {
        session: normalizeSessionDocument(docSnap.id, docSnap.data())
      }
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "SESSION_READ_FAILED",
          message: "Failed to attach session document: " + error.message
        }
      ]
    };
  }
}

function normalizeSessionDocument(sessionId, sessionData) {
  var session = Object.assign({ id: sessionId }, sessionData);
  session.practiceModes = normalizePracticeModes(session.practiceModes);
  return session;
}
