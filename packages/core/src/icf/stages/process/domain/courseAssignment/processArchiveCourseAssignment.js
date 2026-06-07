import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.124-location-icon-upload";

export async function processArchiveCourseAssignment(executionState) {
  var payload = executionState.payload;
  var existingAssignment = executionState.context.courseAssignment;

  try {
    var updateData = {
      status: "archived",
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
          code: "COURSE_ASSIGNMENT_ARCHIVE_FAILED",
          message: "Failed to archive course assignment: " + error.message
        }
      ]
    };
  }
}
