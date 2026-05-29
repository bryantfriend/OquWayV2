export function requireSuperAdminAccess(executionState) {
  var actor = executionState.actor;
  var role = actor && actor.role ? actor.role : "";

  if (role === "superAdmin"
      || role === "platformAdmin"
      || role === "ROLE_SUPER_ADMIN"
      || role === "ROLE_PLATFORM_ADMIN") {
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
