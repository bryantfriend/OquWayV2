import { db, deleteDoc, doc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.114-student-profile-rules";

export async function processDeleteCourseAssignment(executionState) {
  var payload = executionState.payload;
  var existingAssignment = executionState.context.courseAssignment;

  try {
    await deleteDoc(doc(db, "courseAssignments", payload.assignmentId));

    executionState.result = Object.assign({}, existingAssignment, {
      id: payload.assignmentId,
      deleted: true
    });

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "COURSE_ASSIGNMENT_DELETE_FAILED",
          message: "Failed to delete course assignment: " + error.message
        }
      ]
    };
  }
}
