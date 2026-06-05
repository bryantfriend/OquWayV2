import { hasAnyRole, hasRole, isAdmin } from "./roles.js";

export function canManageUsers(userProfile) {
  return hasAnyRole(userProfile, ["superAdmin", "platformAdmin", "schoolAdmin"]);
}

export function canReviewExternalTask(userProfile) {
  return hasAnyRole(userProfile, ["teacher", "assistant", "schoolAdmin", "platformAdmin", "superAdmin"]);
}

export function canViewStudentProgress(userProfile, studentProfile) {
  if (isAdmin(userProfile)) {
    return true;
  }

  if (hasAnyRole(userProfile, ["teacher", "assistant"])) {
    return sharesClass(userProfile, studentProfile);
  }

  if (hasRole(userProfile, "student")) {
    return userProfile && studentProfile && userProfile.id === studentProfile.id;
  }

  return false;
}

function sharesClass(userProfile, studentProfile) {
  var teacherClassIds = readClassIds(userProfile);
  var studentClassIds = readClassIds(studentProfile);

  return teacherClassIds.some(function (classId) {
    return studentClassIds.indexOf(classId) !== -1;
  });
}

function readClassIds(profile) {
  var ids = [];

  appendId(ids, profile && profile.classId);
  appendIds(ids, profile && profile.classIds);
  appendIds(ids, profile && profile.assignedClassIds);

  return ids;
}

function appendIds(ids, values) {
  if (!Array.isArray(values)) {
    return;
  }

  values.forEach(function (value) {
    appendId(ids, value);
  });
}

function appendId(ids, value) {
  if (typeof value === "string" && value && ids.indexOf(value) === -1) {
    ids.push(value);
  }
}
