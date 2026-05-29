export function requireLocationAdminAuthorization(executionState) {
  var actor = executionState.actor;

  if (!actor || !actor.id) {
    return {
      valid: false,
      errors: [
        {
          code: "LOCATION_ADMIN_ACTOR_REQUIRED",
          message: "A signed-in admin or editor is required."
        }
      ]
    };
  }

  if (actor.role === "ROLE_SUPER_ADMIN"
      || actor.role === "ROLE_PLATFORM_ADMIN"
      || actor.role === "ROLE_ADMIN"
      || actor.role === "ROLE_SCHOOL_ADMIN"
      || actor.role === "ROLE_COURSE_CREATOR") {
    return { valid: true };
  }

  return {
    valid: false,
    errors: [
      {
        code: "LOCATION_ADMIN_REQUIRED",
        message: "Only admins or editors can update location login settings."
      }
    ]
  };
}

export function allowPublicLocationRead() {
  return { valid: true };
}
