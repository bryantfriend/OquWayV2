import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.120-student-course-debug-summary";
import { reorderPracticeModeSteps } from "./practiceModeShells.js?v=1.1.120-student-course-debug-summary";

export async function processReorderPracticeModeSteps(executionState) {
  var payload = executionState.payload;
  var session = executionState.context.session;
  var practiceModes = reorderPracticeModeSteps(session.practiceModes, payload.practiceModeKey, payload.orderedStepIds);

  try {
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "sessions", payload.sessionId), {
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
          code: "PRACTICE_MODE_STEP_REORDER_FAILED",
          message: "Failed to reorder practice mode steps: " + error.message
        }
      ]
    };
  }
}

function readCourseCollectionName(executionState) {
  return executionState.context && executionState.context.courseCollectionName
    ? executionState.context.courseCollectionName
    : "catalogCourses";
}
