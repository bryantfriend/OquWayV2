import { userRoles } from "./constants.js";
import { readSafeString } from "./helpers.js";

export function normalizeUserRole(role) {
  var normalizedRole = readSafeString(role).replace(/[^a-z0-9]/gi, "").toLowerCase();

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

  if (normalizedRole === "student" || normalizedRole === "teacher" || normalizedRole === "parent") {
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

export function isSuperAdminRole(role) {
  var normalizedRole = normalizeUserRole(role);

  return normalizedRole === "superAdmin" || normalizedRole === "platformAdmin";
}
