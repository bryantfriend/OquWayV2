import { collection, db, getDocs, query, where } from "../../../../../infrastructure/firebase/firestore.js";

export function createCourseAssignmentId() {
  var randomText = Math.random().toString(36).slice(2, 10);
  return "assignment-" + Date.now() + "-" + randomText;
}

export async function loadCourseAssignments(filters) {
  var assignmentQuery = collection(db, "courseAssignments");
  var queryFilters = [];

  if (filters && filters.courseId) {
    queryFilters.push(where("courseId", "==", filters.courseId));
  }

  if (filters && filters.status) {
    queryFilters.push(where("status", "==", filters.status));
  }

  if (filters && filters.targetType) {
    queryFilters.push(where("targetType", "==", filters.targetType));
  }

  if (filters && filters.targetId) {
    queryFilters.push(where("targetId", "==", filters.targetId));
  }

  if (queryFilters.length > 0) {
    assignmentQuery = query(assignmentQuery, queryFilters[0]);
    if (queryFilters.length === 2) {
      assignmentQuery = query(collection(db, "courseAssignments"), queryFilters[0], queryFilters[1]);
    }
    if (queryFilters.length === 3) {
      assignmentQuery = query(collection(db, "courseAssignments"), queryFilters[0], queryFilters[1], queryFilters[2]);
    }
    if (queryFilters.length === 4) {
      assignmentQuery = query(collection(db, "courseAssignments"), queryFilters[0], queryFilters[1], queryFilters[2], queryFilters[3]);
    }
  }

  return readAssignmentsFromSnapshot(await getDocs(assignmentQuery));
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

function readText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value;
}
