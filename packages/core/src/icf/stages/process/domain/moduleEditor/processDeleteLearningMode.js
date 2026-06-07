import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.110-student-class-alias-query";
import { PRIMARY_MODE_ID, createDefaultLearningModes } from "./learningArchitecture.js?v=1.1.110-student-class-alias-query";

export async function processDeleteLearningMode(executionState) {
  var payload = executionState.payload;
  var modeId = payload.modeId;
  var modes = createDefaultLearningModes(executionState.context.module.learningModes, executionState.context.sessions);

  if (modeId === PRIMARY_MODE_ID || !modes[modeId] || modes[modeId].required) {
    return {
      valid: false,
      errors: [{ code: "PRIMARY_MODE_REQUIRED", message: "Primary Mode cannot be deleted." }]
    };
  }

  modes[modeId] = Object.assign({}, modes[modeId], {
    status: "deleted",
    canDelete: true,
    updatedAt: Date.now()
  });

  try {
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "learningModes", modeId), modes[modeId], { merge: true });
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId), {
      learningModes: modes,
      updatedAt: serverTimestamp()
    }, { merge: true });

    executionState.result = { learningModes: modes, deletedModeId: modeId };
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [{ code: "LEARNING_MODE_DELETE_FAILED", message: "Failed to delete learning mode: " + error.message }]
    };
  }
}

function readCourseCollectionName(executionState) {
  return executionState.context && executionState.context.courseCollectionName
    ? executionState.context.courseCollectionName
    : "catalogCourses";
}
