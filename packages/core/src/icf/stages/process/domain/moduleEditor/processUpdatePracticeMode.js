import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.54-multi-role-assistant";
import { createUpdatedPracticeModes } from "./practiceModeShells.js?v=1.1.54-multi-role-assistant";

export async function processUpdatePracticeMode(executionState) {
  var payload = executionState.payload;
  var session = readSession(executionState.context);
  var practiceModes = createUpdatedPracticeModes(
    session.practiceModes,
    payload.practiceModeKey,
    payload
  );

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

function readCourseCollectionName(executionState) {
  return executionState.context && executionState.context.courseCollectionName
    ? executionState.context.courseCollectionName
    : "catalogCourses";
}
