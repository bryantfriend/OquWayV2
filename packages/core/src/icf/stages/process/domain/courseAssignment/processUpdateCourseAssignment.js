import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js";

export async function processUpdateCourseAssignment(executionState) {
  var payload = executionState.payload;
  var existingAssignment = executionState.context.courseAssignment;

  try {
    var updateData = {
      status: payload.status,
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, "courseAssignments", payload.assignmentId), updateData, { merge: true });

    executionState.result = Object.assign({}, existingAssignment, updateData);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "COURSE_ASSIGNMENT_UPDATE_FAILED",
          message: "Failed to update course assignment: " + error.message
        }
      ]
    };
  }
}
