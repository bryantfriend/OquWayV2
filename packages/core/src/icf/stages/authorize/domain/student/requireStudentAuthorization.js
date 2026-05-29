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

  if (actor.role === "ROLE_STUDENT"
      || actor.role === "ROLE_SUPER_ADMIN"
      || actor.role === "ROLE_PLATFORM_ADMIN"
      || actor.role === "ROLE_ADMIN"
      || actor.role === "ROLE_COURSE_CREATOR") {
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
