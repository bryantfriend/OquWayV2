import { adminRoles } from "../shared/constants/roles.js";
import { hasUserRole, normalizeRoles, userHasAnyRole } from "../domain/users/index.js";

export function getRoles(userProfile) {
  return normalizeRoles(userProfile && userProfile.roles, userProfile && userProfile.role);
}

export function hasRole(userProfile, role) {
  return hasUserRole(userProfile, role);
}

export function hasAnyRole(userProfile, roles) {
  return userHasAnyRole(userProfile, roles);
}

export function isAdmin(userProfile) {
  return userHasAnyRole(userProfile, adminRoles);
}
