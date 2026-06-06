import { loadCourseAssignments, sortAssignments } from "./courseAssignmentHelpers.js?v=1.1.107-student-firebase-auth-chain";

export async function processLoadCourseAssignments(executionState) {
  var payload = executionState.payload || {};

  try {
    var assignments = await loadCourseAssignments({
      courseId: payload.courseId,
      targetType: payload.targetType,
      targetId: payload.targetId,
      status: payload.status
    });

    executionState.result = {
      assignments: sortAssignments(assignments)
    };

    return {
      valid: true,
      data: executionState.result
    };
  } catch (error) {
    pushCourseAssignmentWarning(executionState, error);
    executionState.result = {
      assignments: []
    };

    return {
      valid: true,
      data: executionState.result
    };
  }
}

function pushCourseAssignmentWarning(executionState, error) {
  if (!Array.isArray(executionState.warnings)) {
    executionState.warnings = [];
  }

  executionState.warnings.push({
    code: "COURSE_ASSIGNMENT_LOAD_FAILED",
    message: "Course assignments could not be loaded: " + readErrorMessage(error)
  });

  logCourseAssignmentLoadDebug(error);
}

function logCourseAssignmentLoadDebug(error) {
  if (!isDevelopmentHost()) {
    return;
  }

  console.warn("[course-assignment-debug] LoadCourseAssignmentsIntent returned an empty list after a read failure.", {
    collection: "courseAssignments",
    errorCode: error && error.code ? error.code : "",
    errorMessage: readErrorMessage(error)
  });
}

function isDevelopmentHost() {
  return typeof window !== "undefined"
    && (window.location.hostname === "localhost"
      || window.location.hostname === "127.0.0.1"
      || window.location.hostname === "");
}

function readErrorMessage(error) {
  if (!error) {
    return "unknown error";
  }

  if (error.code && error.message) {
    return error.code + " " + error.message;
  }

  return error.message || String(error);
}
