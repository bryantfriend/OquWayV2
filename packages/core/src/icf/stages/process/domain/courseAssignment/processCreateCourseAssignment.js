import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js";
import { createCourseAssignmentId, loadCourseAssignments } from "./courseAssignmentHelpers.js";

export async function processCreateCourseAssignment(executionState) {
  var payload = executionState.payload;
  var actor = executionState.actor;

  try {
    var duplicateAssignments = findDuplicateAssignments(await loadCourseAssignments({
      courseId: payload.courseId
    }), payload);

    if (duplicateAssignments.length > 0) {
      executionState.warnings.push({
        code: "COURSE_ASSIGNMENT_ALREADY_EXISTS",
        message: "A matching assignment already exists. The existing assignment was returned."
      });
      executionState.result = duplicateAssignments[0];
      return { valid: true };
    }

    var assignmentId = createCourseAssignmentId();
    var assignmentRecord = {
      id: assignmentId,
      courseId: payload.courseId,
      targetType: payload.targetType,
      targetId: payload.targetId,
      status: payload.status,
      assignedBy: actor.id,
      assignedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, "courseAssignments", assignmentId), assignmentRecord);
    executionState.result = assignmentRecord;
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "COURSE_ASSIGNMENT_CREATE_FAILED",
          message: "Failed to create course assignment: " + error.message
        }
      ]
    };
  }
}

function findDuplicateAssignments(assignments, payload) {
  var duplicateAssignments = [];
  var assignmentIndex = 0;

  while (assignmentIndex < assignments.length) {
    var assignment = assignments[assignmentIndex];

    if (assignment.courseId === payload.courseId
        && assignment.targetType === payload.targetType
        && assignment.targetId === payload.targetId
        && assignment.status === payload.status) {
      duplicateAssignments.push(assignment);
    }

    assignmentIndex = assignmentIndex + 1;
  }

  return duplicateAssignments;
}
