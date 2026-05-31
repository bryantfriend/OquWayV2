import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js";
import { normalizePracticeModes } from "../../../process/domain/moduleEditor/practiceModeShells.js";

export async function attachSessionsCollection(executionState) {
  const payload = executionState.payload;

  if (!payload.courseId || !payload.moduleId) {
    return { valid: true };
  }

  try {
    const sessionsRef = collection(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "sessions");
    const snapshot = await getDocs(sessionsRef);
    const sessions = [];

    snapshot.forEach(function (documentSnapshot) {
      sessions.push(normalizeSessionDocument(documentSnapshot.id, documentSnapshot.data()));
    });

    sessions.sort(compareSessionOrder);

    return {
      valid: true,
      data: {
        sessions: sessions
      }
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "SESSIONS_READ_FAILED",
          message: "Failed to attach sessions collection: " + error.message
        }
      ]
    };
  }
}

function readCourseCollectionName(executionState) {
  if (executionState.context && executionState.context.courseCollectionName) {
    return executionState.context.courseCollectionName;
  }

  return "catalogCourses";
}

function normalizeSessionDocument(sessionId, sessionData) {
  var session = Object.assign({ id: sessionId }, sessionData);
  session.practiceModes = normalizePracticeModes(session.practiceModes);
  return session;
}

function compareSessionOrder(firstSession, secondSession) {
  return readOrder(firstSession) - readOrder(secondSession);
}

function readOrder(session) {
  if (session && typeof session.order === "number") {
    return session.order;
  }

  return 0;
}
