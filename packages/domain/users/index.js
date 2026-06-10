import { userRoles } from "../../shared/constants/roles.js";
import { readSafeString } from "../../shared/utils/index.js";

export function normalizeUserRole(role) {
  var normalizedRole = readSafeString(role).replace(/[^a-z0-9]/gi, "").toLowerCase().replace(/^role/, "");

  if (normalizedRole === "schooladmin") {
    return "schoolAdmin";
  }

  if (normalizedRole === "regionaladmin") {
    return "regionalAdmin";
  }

  if (normalizedRole === "ministryuser" || normalizedRole === "ministry") {
    return "ministryUser";
  }

  if (normalizedRole === "platformadmin") {
    return "platformAdmin";
  }

  if (normalizedRole === "superadmin") {
    return "superAdmin";
  }

  if (normalizedRole === "student" || normalizedRole === "teacher" || normalizedRole === "assistant" || normalizedRole === "parent") {
    return normalizedRole;
  }

  return "";
}

export function normalizeRoles(roles, legacyRole) {
  var source = Array.isArray(roles) ? roles.slice() : [];

  if (source.length === 0 && legacyRole) {
    source.push(legacyRole);
  }

  return source.map(normalizeUserRole).filter(function (role, index, list) {
    return role && userRoles.indexOf(role) !== -1 && list.indexOf(role) === index;
  });
}

export function collectUserRoles(user) {
  var roles = Array.isArray(user && user.roles) ? user.roles.slice() : [];

  addRole(roles, user && user.role);
  addClaimedRole(roles, user, "ROLE_TEACHER", "teacher");
  addClaimedRole(roles, user, "ROLE_ASSISTANT", "assistant");
  addClaimedRole(roles, user, "ROLE_COURSE_CREATOR", "courseCreator");
  addClaimedRole(roles, user, "ROLE_SCHOOL_ADMIN", "schoolAdmin");
  addClaimedRole(roles, user, "ROLE_PLATFORM_ADMIN", "platformAdmin");
  addClaimedRole(roles, user, "ROLE_SUPER_ADMIN", "superAdmin");

  return normalizeRoles(roles, "");
}

export function hasUserRole(user, role) {
  return userHasAnyRole(user, [role]);
}

export function userHasAnyRole(user, allowedRoles) {
  var roles = normalizeRoles(user && user.roles, user && user.role);
  var allowed = normalizeRoles(allowedRoles, "");

  return roles.some(function (role) {
    return allowed.indexOf(role) !== -1;
  });
}

export function isSuperAdminRole(role) {
  var normalizedRole = normalizeUserRole(role);

  return normalizedRole === "superAdmin" || normalizedRole === "platformAdmin";
}

export function getDisplayName(user, fallback) {
  return readSafeString(user && (user.displayName || user.name || user.fullName)).trim() || fallback || "User";
}

export function resolveUserPhoto(user) {
  return readSafeString(user && (user.photoUrl || user.profilePhoto || user.avatarUrl)).trim();
}

export function isTeacherUser(user) {
  return hasUserRole(user, "teacher") || user && user.ROLE_TEACHER === true;
}

export function isStudentUser(user) {
  return hasUserRole(user, "student") || user && user.ROLE_STUDENT === true;
}

function addClaimedRole(roles, user, claimKey, role) {
  if (user && user[claimKey] === true) {
    addRole(roles, role);
  }
}

function addRole(roles, role) {
  if (role && roles.indexOf(role) === -1) {
    roles.push(role);
  }
}

export * from "./roleService.js?v=1.1.162-modal-stack";
export * from "./studentIdentity.js?v=1.1.162-modal-stack";
export * from "./teacherIdentity.js?v=1.1.162-modal-stack";
export * from "./userQueries.js?v=1.1.162-modal-stack";
export * from "./userRepository.js?v=1.1.162-modal-stack";
