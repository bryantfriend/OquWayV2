import { db, doc, getDoc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.56-assignment-ownership";
import { buildCourseAssignmentOwnershipFields, readCourseAssignmentOwnership } from "./courseAssignmentOwnershipHelpers.js?v=1.1.56-assignment-ownership";

export async function processLoadCourseAssignmentOwnership(executionState) {
  var payload = executionState.payload || {};

  try {
    var assignmentSnap = await getDoc(doc(db, "courseAssignments", payload.assignmentId));

    if (!assignmentSnap.exists()) {
      return createProcessError("COURSE_ASSIGNMENT_NOT_FOUND", "Course assignment was not found.");
    }

    executionState.result = {
      assignmentId: assignmentSnap.id,
      ownership: readCourseAssignmentOwnership(assignmentSnap.data() || {})
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("COURSE_ASSIGNMENT_OWNERSHIP_LOAD_FAILED", error.message);
  }
}

export async function processAssignCourseTeacher(executionState) {
  var payload = executionState.payload;

  try {
    var ownershipFields = await buildCourseAssignmentOwnershipFields(payload);

    await setDoc(doc(db, "courseAssignments", payload.assignmentId), {
      responsibleTeacherId: ownershipFields.responsibleTeacherId,
      assistantIds: ownershipFields.assistantIds,
      responsibleTeacherName: ownershipFields.responsibleTeacherName,
      assistantNames: ownershipFields.assistantNames,
      updatedAt: serverTimestamp()
    }, { merge: true });

    executionState.result = {
      assignmentId: payload.assignmentId,
      ownership: ownershipFields
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("COURSE_TEACHER_ASSIGN_FAILED", error.message);
  }
}

export async function processAssignCourseAssistants(executionState) {
  var payload = executionState.payload;

  try {
    var ownershipFields = await buildCourseAssignmentOwnershipFields(payload);

    await setDoc(doc(db, "courseAssignments", payload.assignmentId), {
      assistantIds: ownershipFields.assistantIds,
      assistantNames: ownershipFields.assistantNames,
      updatedAt: serverTimestamp()
    }, { merge: true });

    executionState.result = {
      assignmentId: payload.assignmentId,
      ownership: ownershipFields
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("COURSE_ASSISTANTS_ASSIGN_FAILED", error.message);
  }
}

function createProcessError(code, message) {
  return {
    valid: false,
    errors: [
      {
        code: code,
        message: message
      }
    ]
  };
}
