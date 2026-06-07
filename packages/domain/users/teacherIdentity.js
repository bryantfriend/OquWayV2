import { getUserRoles } from "./roleService.js";

export function resolveTeacherIdentity(context, profile, actor) {
  var safeContext = context || {};
  var safeProfile = profile || {};
  var linkedProfile = safeProfile.linkedProfile || {};
  var safeActor = actor || {};
  var authUid = readText(safeContext.authUid || safeActor.authUid || safeActor.id || safeProfile.authUid);
  var userDocId = readText(safeProfile.id || safeContext.userDocId || safeContext.profileUserId);
  var authUidFromProfile = readText(safeProfile.authUid || linkedProfile.authUid);
  var teacherIdentity = {
    authUid: authUid,
    userDocId: userDocId,
    profileUserId: readText(safeContext.profileUserId || safeProfile.profileUserId || linkedProfile.profileUserId),
    userId: readText(safeProfile.userId || linkedProfile.userId),
    teacherId: readText(safeProfile.teacherId || linkedProfile.teacherId),
    authUidFromProfile: authUidFromProfile,
    email: readText(safeProfile.email || linkedProfile.email || safeActor.email),
    locationId: readText(safeProfile.locationId || linkedProfile.locationId),
    primaryLocationId: readText(safeProfile.primaryLocationId || linkedProfile.primaryLocationId),
    schoolId: readText(safeProfile.schoolId || linkedProfile.schoolId),
    locationIds: readTextArray([safeProfile.locationIds, linkedProfile.locationIds]),
    schoolIds: readTextArray([safeProfile.schoolIds, linkedProfile.schoolIds]),
    classId: readText(safeProfile.classId || linkedProfile.classId),
    classIds: readTextArray([safeProfile.classIds, linkedProfile.classIds]),
    assignedClassIds: readTextArray([safeProfile.assignedClassIds, linkedProfile.assignedClassIds]),
    roles: getUserRoles(safeProfile)
  };

  teacherIdentity.teacherProfileIds = readTextArray([
    teacherIdentity.authUid,
    teacherIdentity.userDocId,
    teacherIdentity.profileUserId,
    teacherIdentity.userId,
    teacherIdentity.teacherId,
    teacherIdentity.authUidFromProfile,
    safeContext.teacherOwnershipIds
  ]);
  teacherIdentity.teacherClassIdentifiers = readTextArray([
    teacherIdentity.classId,
    teacherIdentity.classIds,
    teacherIdentity.assignedClassIds
  ]);
  teacherIdentity.teacherLocationIdentifiers = readTextArray([
    teacherIdentity.locationId,
    teacherIdentity.primaryLocationId,
    teacherIdentity.schoolId,
    teacherIdentity.locationIds,
    teacherIdentity.schoolIds
  ]);

  return teacherIdentity;
}

export function readTeacherProfileIds(teacherIdentity) {
  return teacherIdentity && Array.isArray(teacherIdentity.teacherProfileIds)
    ? teacherIdentity.teacherProfileIds.slice()
    : [];
}

export function readTeacherClassIdentifiers(teacherIdentity) {
  return teacherIdentity && Array.isArray(teacherIdentity.teacherClassIdentifiers)
    ? teacherIdentity.teacherClassIdentifiers.slice()
    : [];
}

export function readTeacherLocationIdentifiers(teacherIdentity) {
  return teacherIdentity && Array.isArray(teacherIdentity.teacherLocationIdentifiers)
    ? teacherIdentity.teacherLocationIdentifiers.slice()
    : [];
}

function readTextArray(values) {
  var result = [];
  appendTextValues(result, values);
  return result;
}

function appendTextValues(result, value) {
  if (typeof value === "string") {
    appendUniqueText(result, value);
    return;
  }

  if (!Array.isArray(value)) {
    return;
  }

  value.forEach(function (item) {
    appendTextValues(result, item);
  });
}

function appendUniqueText(result, value) {
  var text = readText(value);

  if (text && result.indexOf(text) === -1) {
    result.push(text);
  }
}

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
}
