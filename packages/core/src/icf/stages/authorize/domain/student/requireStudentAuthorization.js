import { hasAnyRole } from "../../core/roleAuthorization.js?v=1.1.54-multi-role-assistant";

export function requireStudentAuthorization(executionState) {
  var actor = executionState.actor;

  if (!actor || !actor.id) {
    return {
      valid: false,
      errors: [
        {
          code: "STUDENT_ACTOR_REQUIRED",
          message: "A signed-in student is required."
        }
      ]
    };
  }

  if (hasAnyRole(actor, [
      "student",
      "superAdmin",
      "platformAdmin",
      "admin",
      "courseCreator"
  ])) {
    return { valid: true };
  }

  return {
    valid: false,
    errors: [
      {
        code: "STUDENT_ROLE_REQUIRED",
        message: "Only students can use the student player."
      }
    ]
  };
}
