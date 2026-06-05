import { getCourseAssignments } from "../../../../../../../domain/assignments/index.js";

export function createCourseAssignmentId() {
  var randomText = Math.random().toString(36).slice(2, 10);
  return "assignment-" + Date.now() + "-" + randomText;
}

export async function loadCourseAssignments(filters) {
  return getCourseAssignments(filters);
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

function readText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value;
}
