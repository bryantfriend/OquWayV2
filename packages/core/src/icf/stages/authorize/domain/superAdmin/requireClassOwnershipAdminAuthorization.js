import { hasAnyRole } from "../../core/roleAuthorization.js?v=1.1.79-user-command-center";

export function requireClassOwnershipAdminAuthorization(executionState) {
  var actor = executionState.actor;

  if (hasAnyRole(actor, ["superAdmin", "platformAdmin", "schoolAdmin"])) {
    return { valid: true };
  }

  return {
    valid: false,
    errors: [
      {
        code: "CLASS_OWNERSHIP_ADMIN_REQUIRED",
        message: "Only school admins, platform admins, or super admins can manage class ownership."
      }
    ]
  };
}
