import { loadCourseAssignments, sortAssignments } from "./courseAssignmentHelpers.js?v=1.1.29-module-render-fix";

export async function processListCourseAssignments(executionState) {
  var payload = executionState.payload || {};

  try {
    var filters = {};

    if (payload.courseId) {
      filters.courseId = payload.courseId;
    }

    if (payload.targetType) {
      filters.targetType = payload.targetType;
    }

    if (payload.targetId) {
      filters.targetId = payload.targetId;
    }

    if (payload.status) {
      filters.status = payload.status;
    }

    executionState.result = {
      assignments: sortAssignments(await loadCourseAssignments(filters))
    };

    return {
      valid: true,
      data: executionState.result
    };
  } catch (error) {
    executionState.warnings.push({
      code: "COURSE_ASSIGNMENT_LIST_FAILED",
      message: "Course assignments could not be loaded: " + readErrorMessage(error)
    });
    logCourseAssignmentListDebug(error, filters);
    executionState.result = {
      assignments: []
    };
    return {
      valid: true,
      data: executionState.result
    };
  }
}

function logCourseAssignmentListDebug(error, filters) {
  if (!isDevelopmentHost()) {
    return;
  }

  console.warn("[course-assignment-debug] ListCourseAssignmentsIntent process issue.", {
    collection: "courseAssignments",
    errorCode: error && error.code ? error.code : "",
    errorMessage: readErrorMessage(error),
    filters: filters || {}
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
