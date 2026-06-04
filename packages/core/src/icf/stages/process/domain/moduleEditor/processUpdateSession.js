import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.54-multi-role-assistant";

export async function processUpdateSession(executionState) {
  const payload = executionState.payload;
  const sessionUpdate = createSessionUpdate(payload);

  try {
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "sessions", payload.sessionId), sessionUpdate, { merge: true });
    executionState.result = Object.assign({ id: payload.sessionId }, sessionUpdate);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "SESSION_UPDATE_WRITE_FAILED",
          message: "Failed to update session: " + error.message
        }
      ]
    };
  }
}

function createSessionUpdate(payload) {
  return {
    title: payload.title,
    description: payload.description,
    status: payload.status,
    updatedAt: serverTimestamp()
  };
}

function readCourseCollectionName(executionState) {
  return executionState.context && executionState.context.courseCollectionName
    ? executionState.context.courseCollectionName
    : "catalogCourses";
}
