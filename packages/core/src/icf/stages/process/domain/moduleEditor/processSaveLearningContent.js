import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.63-external-task-student-feedback";
import { normalizeLearningContentPayload } from "./learningArchitecture.js?v=1.1.63-external-task-student-feedback";

export async function processSaveLearningContent(executionState) {
  var payload = executionState.payload;
  var learningContent = normalizeLearningContentPayload(payload);

  try {
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId), {
      learningContent: learningContent,
      learningContentUpdatedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    await mirrorLearningContent(readCourseCollectionName(executionState), payload.courseId, payload.moduleId, learningContent);

    executionState.result = { learningContent: learningContent };
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [{ code: "LEARNING_CONTENT_SAVE_FAILED", message: "Failed to save learning content: " + error.message }]
    };
  }
}

async function mirrorLearningContent(collectionName, courseId, moduleId, learningContent) {
  var sections = Object.keys(learningContent || {});
  var sectionIndex = 0;

  while (sectionIndex < sections.length) {
    var section = sections[sectionIndex];
    await setDoc(doc(db, collectionName, courseId, "modules", moduleId, "learningContent", section), {
      id: section,
      type: section,
      value: learningContent[section],
      updatedAt: serverTimestamp()
    }, { merge: true });
    sectionIndex = sectionIndex + 1;
  }
}

function readCourseCollectionName(executionState) {
  return executionState.context && executionState.context.courseCollectionName
    ? executionState.context.courseCollectionName
    : "catalogCourses";
}
