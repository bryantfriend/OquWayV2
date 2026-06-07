import { readSafeString } from "../../shared/utils/index.js";

export function normalizeClass(classRecord) {
  var safeClass = classRecord || {};

  return Object.assign({}, safeClass, {
    id: readSafeString(safeClass.id || safeClass.classId),
    name: getClassDisplayName(safeClass),
    locationId: getClassLocationId(safeClass),
    status: readSafeString(safeClass.status || "active") || "active",
    primaryTeacherId: readSafeString(safeClass.primaryTeacherId),
    assistantIds: Array.isArray(safeClass.assistantIds) ? safeClass.assistantIds.slice() : []
  });
}

export function getClassDisplayName(classRecord) {
  return readSafeString(classRecord && (classRecord.name || classRecord.displayName || classRecord.title)).trim() || "Untitled Class";
}

export function getClassLocationId(classRecord) {
  return readSafeString(classRecord && (classRecord.locationId || classRecord.locId || classRecord.schoolId || classRecord.primaryLocationId)).trim();
}

export * from "./classQueries.js";
export * from "./classRepository.js?v=1.1.117-student-identity-binding";
