import { hasAnyRole } from "../../core/roleAuthorization.js?v=1.1.162-modal-stack";

export function requireSuperAdminAccess(executionState) {
  var actor = executionState.actor;

  if (hasAnyRole(actor, ["superAdmin", "platformAdmin"])) {
    return { valid: true };
  }

  return {
    valid: false,
    errors: [
      {
        code: "SUPER_ADMIN_ACCESS_REQUIRED",
        message: "Only super admins or platform admins can use this dashboard."
      }
    ]
  };
}
