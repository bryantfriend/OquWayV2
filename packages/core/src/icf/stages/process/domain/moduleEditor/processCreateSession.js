import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.62-external-task-review-loop";
import { createDefaultPracticeModes } from "./practiceModeShells.js?v=1.1.62-external-task-review-loop";

export async function processCreateSession(executionState) {
  const payload = executionState.payload;
  const context = executionState.context;
  const sessionId = generateId("session");
  const sessionRecord = createSessionRecord(sessionId, payload, context);

  try {
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "sessions", sessionId), sessionRecord);
    executionState.result = sessionRecord;
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "SESSION_CREATE_WRITE_FAILED",
          message: "Failed to create session: " + error.message
        }
      ]
    };
  }
}

function createSessionRecord(sessionId, payload, context) {
  const order = readNextOrder(context.sessions);

  return {
    id: sessionId,
    title: payload.title,
    description: payload.description,
    sessionNumber: order,
    order: order,
    status: payload.status,
    practiceModes: createDefaultPracticeModes(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

function readNextOrder(sessions) {
  if (!Array.isArray(sessions)) {
    return 1;
  }

  return sessions.length + 1;
}

function generateId(prefix) {
  const randomText = Math.random().toString(36).slice(2, 10);
  return prefix + "-" + Date.now() + "-" + randomText;
}

function readCourseCollectionName(executionState) {
  return executionState.context && executionState.context.courseCollectionName
    ? executionState.context.courseCollectionName
    : "catalogCourses";
}
