import { userHasAnyRole } from "../../../domain/users/index.js";

export function requireAdminAccess(executionState) {
  var actor = executionState.context ? executionState.context.actor : null;

  if (!actor || !userHasAnyRole(actor, ["superAdmin", "schoolAdmin"])) {
    return {
      valid: false,
      errors: [{ code: "ADMIN_ACCESS_REQUIRED", message: "Admin access is required." }]
    };
  }

  return { valid: true };
}

export function allowAuthorizedLegacyFlow() {
  return { valid: true };
}

export function requireUserManagementAccess(executionState) {
  var actor = executionState.context ? executionState.context.actor : null;

  if (!actor || !userHasAnyRole(actor, ["superAdmin", "schoolAdmin"])) {
    return {
      valid: false,
      errors: [{ code: "USER_MANAGEMENT_ACCESS_REQUIRED", message: "User management access requires a School Admin or Super Admin role." }]
    };
  }

  return { valid: true };
}
