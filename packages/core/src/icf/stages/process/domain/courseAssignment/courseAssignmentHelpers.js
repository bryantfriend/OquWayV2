import { collection, db, getDocs, query, where } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.54-multi-role-assistant";

export function createCourseAssignmentId() {
  var randomText = Math.random().toString(36).slice(2, 10);
  return "assignment-" + Date.now() + "-" + randomText;
}

export async function loadCourseAssignments(filters) {
  var safeFilters = filters || {};
  var assignmentsRef = collection(db, "courseAssignments");
  var constraints = [];

  appendEqualityConstraint(constraints, "courseId", safeFilters.courseId);
  appendEqualityConstraint(constraints, "status", safeFilters.status);
  appendEqualityConstraint(constraints, "targetType", safeFilters.targetType);
  appendEqualityConstraint(constraints, "targetId", safeFilters.targetId);

  var snapshot = constraints.length > 0
    ? await getDocs(query(assignmentsRef, ...constraints))
    : await getDocs(assignmentsRef);

  return filterAssignments(readAssignmentsFromSnapshot(snapshot), safeFilters);
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

function appendEqualityConstraint(constraints, fieldName, value) {
  if (!value) {
    return;
  }

  constraints.push(where(fieldName, "==", value));
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
