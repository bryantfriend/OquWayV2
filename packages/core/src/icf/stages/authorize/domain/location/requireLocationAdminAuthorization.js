import { hasAnyRole } from "../../core/roleAuthorization.js?v=1.1.82-shared-command-center-shell";

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

  if (hasAnyRole(actor, [
      "superAdmin",
      "platformAdmin",
      "admin",
      "schoolAdmin",
      "courseCreator",
      "assistant"
  ])) {
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
