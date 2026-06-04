import { userHasAnyRole } from "../../shared/permissions.js";

export function requireAdminAccess(executionState) {
  var actor = executionState.context ? executionState.context.actor : null;

  if (!actor || !userHasAnyRole(actor, ["superAdmin", "platformAdmin"])) {
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
