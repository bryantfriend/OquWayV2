export function requireCourseAssignmentAdminAuthorization(executionState) {
  var actor = executionState.actor;

  if (!actor || !actor.id) {
    return {
      valid: false,
      errors: [
        {
          code: "COURSE_ASSIGNMENT_ACTOR_REQUIRED",
          message: "A signed-in admin or course creator is required."
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
        code: "COURSE_ASSIGNMENT_ADMIN_REQUIRED",
        message: "Only admins or course creators can manage course assignments."
      }
    ]
  };
}
