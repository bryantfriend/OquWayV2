import { collection, db, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.54-multi-role-assistant";
import { sortAssignments } from "./courseAssignmentHelpers.js?v=1.1.56-assignment-ownership";

export async function processLoadCourseAssignments(executionState) {
  var payload = executionState.payload || {};

  try {
    var assignments = filterAssignments(await readAllCourseAssignments(), {
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

async function readAllCourseAssignments() {
  var assignments = [];
  var snapshot = await getDocs(collection(db, "courseAssignments"));

  snapshot.forEach(function (assignmentSnap) {
    assignments.push(Object.assign({ id: assignmentSnap.id }, assignmentSnap.data() || {}));
  });

  return assignments;
}

function filterAssignments(assignments, filters) {
  var safeAssignments = Array.isArray(assignments) ? assignments : [];

  return safeAssignments.filter(function (assignment) {
    return matchesFilter(assignment, "courseId", filters.courseId)
      && matchesFilter(assignment, "targetType", filters.targetType)
      && matchesTargetId(assignment, filters.targetId)
      && matchesFilter(assignment, "status", filters.status);
  });
}

function matchesFilter(assignment, fieldName, expectedValue) {
  if (!expectedValue) {
    return true;
  }

  return assignment && assignment[fieldName] === expectedValue;
}

function matchesTargetId(assignment, expectedTargetId) {
  if (!expectedTargetId) {
    return true;
  }

  return assignment
    && (assignment.targetId === expectedTargetId
      || assignment.classId === expectedTargetId
      || assignment.studentId === expectedTargetId
      || assignment.locationId === expectedTargetId);
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
