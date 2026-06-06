import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.109-student-assignment-status-fallback";

export async function attachCourseAssignmentCourseContext(executionState) {
  var payload = executionState.payload || {};

  if (!payload.courseId) {
    return {
      valid: true,
      data: {
        assignmentCourse: null
      }
    };
  }

  try {
    var courseRef = doc(db, "courses", payload.courseId);
    var courseSnap = await getDoc(courseRef);

    if (!courseSnap.exists()) {
      return {
        valid: false,
        errors: [
          {
            code: "COURSE_ASSIGNMENT_COURSE_NOT_FOUND",
            message: "The selected course could not be found."
          }
        ]
      };
    }

    return {
      valid: true,
      data: {
        assignmentCourse: Object.assign({ id: courseSnap.id }, courseSnap.data())
      }
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "COURSE_ASSIGNMENT_COURSE_LOOKUP_FAILED",
          message: "Failed to verify course before assignment: " + error.message
        }
      ]
    };
  }
}

export async function attachCourseAssignmentContext(executionState) {
  var payload = executionState.payload || {};

  try {
    var assignmentRef = doc(db, "courseAssignments", payload.assignmentId);
    var assignmentSnap = await getDoc(assignmentRef);

    if (!assignmentSnap.exists()) {
      return {
        valid: false,
        errors: [
          {
            code: "COURSE_ASSIGNMENT_NOT_FOUND",
            message: "The course assignment could not be found."
          }
        ]
      };
    }

    return {
      valid: true,
      data: {
        courseAssignment: Object.assign({ id: assignmentSnap.id }, assignmentSnap.data())
      }
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "COURSE_ASSIGNMENT_LOOKUP_FAILED",
          message: "Failed to load course assignment: " + error.message
        }
      ]
    };
  }
}
