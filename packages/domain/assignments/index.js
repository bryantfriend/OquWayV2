import { readSafeString } from "../../shared/utils/index.js";

export function normalizeCourseAssignment(assignment) {
  var safeAssignment = assignment || {};

  return Object.assign({}, safeAssignment, {
    id: readSafeString(safeAssignment.id || safeAssignment.assignmentId),
    assignmentId: readSafeString(safeAssignment.assignmentId || safeAssignment.id),
    assignmentType: readSafeString(safeAssignment.assignmentType || "course") || "course",
    courseId: readSafeString(safeAssignment.courseId),
    targetType: readSafeString(safeAssignment.targetType),
    targetId: readSafeString(safeAssignment.targetId),
    locationId: readSafeString(safeAssignment.locationId),
    classId: readSafeString(safeAssignment.classId),
    studentId: readSafeString(safeAssignment.studentId),
    responsibleTeacherId: readSafeString(safeAssignment.responsibleTeacherId),
    assistantIds: Array.isArray(safeAssignment.assistantIds) ? safeAssignment.assistantIds.slice() : [],
    visibility: readSafeString(safeAssignment.visibility || "visible") || "visible",
    status: readSafeString(safeAssignment.status || "active") || "active"
  });
}

export function isActiveAssignment(assignment) {
  var status = readSafeString(assignment && assignment.status).toLowerCase();

  return !status || status === "active" || status === "assigned";
}

export function assignmentBelongsToTeacher(assignment, teacherIds) {
  var safeAssignment = assignment || {};
  var ids = Array.isArray(teacherIds) ? teacherIds : [];

  return ids.indexOf(safeAssignment.responsibleTeacherId) !== -1
    || (Array.isArray(safeAssignment.assistantIds) && safeAssignment.assistantIds.some(function (teacherId) {
      return ids.indexOf(teacherId) !== -1;
    }));
}

export * from "./assignmentRepository.js?v=1.1.118-fruit-login-student-identity";
