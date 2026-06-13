import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.82-shared-command-center-shell";

export async function processUpdateCourseStatus(executionState) {
  var payload = executionState.payload || {};
  var context = executionState.context || {};
  var update = {
    status: payload.status,
    isArchived: payload.status === "archived",
    isDeleted: false,
    updatedAt: serverTimestamp(),
    updatedBy: context.updatedBy || ""
  };

  try {
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId), update, { merge: true });
    executionState.result = Object.assign({}, context.course || {}, update, {
      id: payload.courseId
    });
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [{ code: "COURSE_STATUS_UPDATE_FAILED", message: "Failed to update course status: " + error.message }]
    };
  }
}

function readCourseCollectionName(executionState) {
  return executionState.context && executionState.context.courseCollectionName
    ? executionState.context.courseCollectionName
    : "catalogCourses";
}
