import { collection, db, getDocs } from "../../../../../infrastructure/firebase/firestore.js";

export function createCourseAssignmentId() {
  var randomText = Math.random().toString(36).slice(2, 10);
  return "assignment-" + Date.now() + "-" + randomText;
}

export async function loadCourseAssignments(filters) {
  return filterAssignments(readAssignmentsFromSnapshot(await getDocs(collection(db, "courseAssignments"))), filters || {});
}

export function sortAssignments(assignments) {
  assignments.sort(function (a, b) {
    var courseComparison = readText(a.courseId).localeCompare(readText(b.courseId));

    if (courseComparison !== 0) {
      return courseComparison;
    }

    var targetComparison = readText(a.targetType).localeCompare(readText(b.targetType));

    if (targetComparison !== 0) {
      return targetComparison;
    }

    return readText(a.targetId).localeCompare(readText(b.targetId));
  });

  return assignments;
}

function readAssignmentsFromSnapshot(snapshot) {
  var assignments = [];

  snapshot.forEach(function (assignmentSnap) {
    assignments.push(Object.assign({ id: assignmentSnap.id }, assignmentSnap.data()));
  });

  return assignments;
}

function filterAssignments(assignments, filters) {
  return assignments.filter(function (assignment) {
    return matchesFilter(assignment, "courseId", filters.courseId)
      && matchesFilter(assignment, "status", filters.status)
      && matchesFilter(assignment, "targetType", filters.targetType)
      && matchesTargetId(assignment, filters.targetId);
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

function readText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value;
}
