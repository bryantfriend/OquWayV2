import { loadCourseAssignments, sortAssignments } from "./courseAssignmentHelpers.js";

export async function processListCourseAssignments(executionState) {
  var payload = executionState.payload || {};

  try {
    var filters = {};

    if (payload.courseId) {
      filters.courseId = payload.courseId;
    }

    if (payload.status) {
      filters.status = payload.status;
    }

    executionState.result = {
      assignments: sortAssignments(await loadCourseAssignments(filters))
    };

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "COURSE_ASSIGNMENT_LIST_FAILED",
          message: "Failed to load course assignments: " + error.message
        }
      ]
    };
  }
}
