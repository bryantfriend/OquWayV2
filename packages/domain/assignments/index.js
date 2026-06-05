import { readSafeString } from "../../shared/utils/index.js";

export function normalizeCourseAssignment(assignment) {
  var safeAssignment = assignment || {};

  return Object.assign({}, safeAssignment, {
    id: readSafeString(safeAssignment.id || safeAssignment.assignmentId),
    courseId: readSafeString(safeAssignment.courseId),
    targetType: readSafeString(safeAssignment.targetType),
    targetId: readSafeString(safeAssignment.targetId),
    responsibleTeacherId: readSafeString(safeAssignment.responsibleTeacherId),
    assistantIds: Array.isArray(safeAssignment.assistantIds) ? safeAssignment.assistantIds.slice() : [],
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

export * from "./assignmentRepository.js";
