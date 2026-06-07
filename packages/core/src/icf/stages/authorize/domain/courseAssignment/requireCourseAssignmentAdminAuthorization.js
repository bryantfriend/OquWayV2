import { hasAnyRole } from "../../core/roleAuthorization.js?v=1.1.121-student-dashboard-open-clean";

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

  if (hasAnyRole(actor, [
      "superAdmin",
      "platformAdmin",
      "admin",
      "schoolAdmin",
      "courseCreator",
      "assistant",
      "editor"
  ])) {
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
