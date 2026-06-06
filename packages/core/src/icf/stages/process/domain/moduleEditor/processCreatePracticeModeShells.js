import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.80-course-module-command-center";
import { normalizePracticeModes } from "./practiceModeShells.js?v=1.1.80-course-module-command-center";

export async function processCreatePracticeModeShells(executionState) {
  var payload = executionState.payload;
  var session = readSession(executionState.context);
  var practiceModes = normalizePracticeModes(session.practiceModes);

  try {
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "sessions", payload.sessionId), {
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

function readCourseCollectionName(executionState) {
  return executionState.context && executionState.context.courseCollectionName
    ? executionState.context.courseCollectionName
    : "catalogCourses";
}
