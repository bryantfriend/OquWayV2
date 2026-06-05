import {
  getActorClaimRoles,
  getUserRoles,
  isActiveUserProfile,
  isExplicitStudentOrParentProfile,
  isStudentDashboardProfile,
  isTeacherDashboardRole,
  mergeTrustedTeacherDashboardRoles
} from "../domain/users/index.js";
import { hasAnyRole, hasRole, isAdmin } from "./roles.js";

export function canAccessTeacherDashboard(userProfile, actor) {
  var profileRoles = getUserRoles(userProfile);
  var claimsRoles = getActorClaimRoles(actor || {});
  var roles = mergeTrustedTeacherDashboardRoles(claimsRoles, profileRoles);

  if (!userProfile || !isActiveUserProfile(userProfile)) {
    return false;
  }

  if (isExplicitStudentOrParentProfile(profileRoles)) {
    return false;
  }

  return roles.some(isTeacherDashboardRole);
}

export function canAccessStudentDashboard(userProfile) {
  return isStudentDashboardProfile(userProfile);
}

export function canViewCourse(userProfile, course) {
  if (isAdmin(userProfile)) {
    return true;
  }

  if (!canAccessStudentDashboard(userProfile)) {
    return false;
  }

  if (!course || !course.id) {
    return false;
  }

  return readAssignedCourseIds(userProfile).indexOf(course.id) !== -1
    || readAssignedCourseIds(userProfile).indexOf(course.courseId) !== -1;
}

export function canAccessCourseCreator(userProfile) {
  return hasAnyRole(userProfile, ["courseCreator", "teacher", "assistant", "schoolAdmin", "platformAdmin", "superAdmin"]);
}

export function canEditCourse(userProfile) {
  return canAccessCourseCreator(userProfile);
}

export function canPublishModule(userProfile) {
  return hasAnyRole(userProfile, ["courseCreator", "schoolAdmin", "platformAdmin", "superAdmin"]);
}

export function canViewProgress(userProfile, progress) {
  if (isAdmin(userProfile)) {
    return true;
  }

  return canAccessStudentDashboard(userProfile)
    && progress
    && (!progress.studentId || progress.studentId === userProfile.id || progress.studentId === userProfile.authUid);
}

export function canManageUsers(userProfile) {
  return hasAnyRole(userProfile, ["superAdmin", "platformAdmin", "schoolAdmin"]);
}

export function canReviewExternalTask(userProfile) {
  return hasAnyRole(userProfile, ["teacher", "assistant", "courseCreator", "schoolAdmin", "platformAdmin", "superAdmin", "admin"])
    || Boolean(userProfile && (userProfile.ROLE_TEACHER === true
      || userProfile.ROLE_ASSISTANT === true
      || userProfile.ROLE_COURSE_CREATOR === true
      || userProfile.ROLE_SCHOOL_ADMIN === true
      || userProfile.ROLE_PLATFORM_ADMIN === true
      || userProfile.ROLE_SUPER_ADMIN === true));
}

export function canSubmitExternalTask(userProfile) {
  return hasAnyRole(userProfile, ["student", "schoolAdmin", "platformAdmin", "superAdmin"])
    || Boolean(userProfile && (userProfile.ROLE_STUDENT === true
      || userProfile.ROLE_SCHOOL_ADMIN === true
      || userProfile.ROLE_PLATFORM_ADMIN === true
      || userProfile.ROLE_SUPER_ADMIN === true));
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

function readAssignedCourseIds(userProfile) {
  var ids = [];

  appendIds(ids, userProfile && userProfile.assignedCourseIds);
  appendIds(ids, userProfile && userProfile.courseIds);
  appendCourseRecords(ids, userProfile && userProfile.courses);
  appendCourseRecords(ids, userProfile && userProfile.assignedCourses);

  return ids;
}

function appendCourseRecords(ids, values) {
  if (!Array.isArray(values)) {
    return;
  }

  values.forEach(function (value) {
    if (typeof value === "string") {
      appendId(ids, value);
      return;
    }

    appendId(ids, value && (value.id || value.courseId || value.refId || value.uid));
  });
}
