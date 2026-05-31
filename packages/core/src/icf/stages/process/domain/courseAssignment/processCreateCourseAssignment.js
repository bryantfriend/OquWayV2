import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js";
import { createCourseAssignmentId, loadCourseAssignments } from "./courseAssignmentHelpers.js";

export async function processCreateCourseAssignment(executionState) {
  var payload = executionState.payload;
  var actor = executionState.actor;

  try {
    var duplicateAssignments = findDuplicateAssignments(await loadCourseAssignments({
      courseId: payload.courseId,
      targetType: payload.targetType,
      targetId: payload.targetId
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
      assignmentType: payload.assignmentType || "course",
      courseId: payload.courseId,
      moduleId: payload.moduleId || null,
      targetType: payload.targetType,
      targetId: payload.targetId,
      locationId: payload.locationId || "",
      classId: payload.targetType === "class" ? payload.classId || payload.targetId : "",
      studentId: payload.targetType === "student" ? payload.studentId || payload.targetId : null,
      status: payload.status,
      visibility: payload.visibility || "visible",
      assignedBy: actor.id,
      assignedAt: serverTimestamp(),
      startsAt: payload.startsAt || null,
      dueAt: payload.dueAt || null,
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
