import { collection, db, getDocs, query, where } from "../../../../../packages/core/src/infrastructure/firebase/firestore.js?v=1.1.56-assignment-ownership";

export async function getTeacherCourseAssignments(teacherId) {
  var safeTeacherId = typeof teacherId === "string" ? teacherId.trim() : "";
  var assignments = [];

  if (!safeTeacherId) {
    return assignments;
  }

  await appendAssignmentQuery(assignments, query(collection(db, "courseAssignments"), where("responsibleTeacherId", "==", safeTeacherId)));
  await appendAssignmentQuery(assignments, query(collection(db, "courseAssignments"), where("assistantIds", "array-contains", safeTeacherId)));

  return assignments.sort(function (a, b) {
    return String(a.courseId || a.id || "").localeCompare(String(b.courseId || b.id || ""));
  });
}

async function appendAssignmentQuery(assignments, assignmentQuery) {
  var snapshot = await getDocs(assignmentQuery);

  snapshot.forEach(function (assignmentSnap) {
    if (!assignments.some(function (assignment) { return assignment.id === assignmentSnap.id; })) {
      assignments.push(Object.assign({ id: assignmentSnap.id }, assignmentSnap.data() || {}));
    }
  });
}
