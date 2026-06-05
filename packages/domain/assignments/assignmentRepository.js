import { collection, db, getDocs, query, where } from "../../firebase/index.js";
import { isActiveAssignment, normalizeCourseAssignment } from "./index.js";

export async function getCourseAssignments(filters) {
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

export async function getAssignmentsForCourse(courseId) {
  if (!courseId) {
    return [];
  }

  return loadAssignments(query(
    collection(db, "courseAssignments"),
    where("courseId", "==", courseId)
  ));
}

export async function getAssignmentsForClass(classId) {
  if (!classId) {
    return [];
  }

  return loadAssignments(query(
    collection(db, "courseAssignments"),
    where("targetType", "==", "class"),
    where("targetId", "==", classId)
  ));
}

export function normalizeAssignment(rawAssignment) {
  return normalizeCourseAssignment(rawAssignment);
}

async function loadAssignments(assignmentQuery) {
  var snapshot = await getDocs(assignmentQuery);
  var assignments = [];

  snapshot.forEach(function (assignmentSnap) {
    var assignment = normalizeCourseAssignment(Object.assign({ id: assignmentSnap.id }, assignmentSnap.data() || {}));

    if (isActiveAssignment(assignment)) {
      assignments.push(assignment);
    }
  });

  return assignments;
}

function readAssignmentsFromSnapshot(snapshot) {
  var assignments = [];

  snapshot.forEach(function (assignmentSnap) {
    assignments.push(normalizeCourseAssignment(Object.assign({ id: assignmentSnap.id }, assignmentSnap.data() || {})));
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
