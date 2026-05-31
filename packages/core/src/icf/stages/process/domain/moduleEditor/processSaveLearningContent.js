import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js";
import { normalizeLearningContentPayload } from "./learningArchitecture.js";

export async function processSaveLearningContent(executionState) {
  var payload = executionState.payload;
  var learningContent = normalizeLearningContentPayload(payload);

  try {
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId), {
      learningContent: learningContent,
      learningContentUpdatedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });

    executionState.result = { learningContent: learningContent };
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [{ code: "LEARNING_CONTENT_SAVE_FAILED", message: "Failed to save learning content: " + error.message }]
    };
  }
}

function readCourseCollectionName(executionState) {
  return executionState.context && executionState.context.courseCollectionName
    ? executionState.context.courseCollectionName
    : "catalogCourses";
}
