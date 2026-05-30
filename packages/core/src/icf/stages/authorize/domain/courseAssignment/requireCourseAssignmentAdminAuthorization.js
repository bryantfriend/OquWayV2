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

  var role = normalizeCourseAssignmentAdminRole(actor.role);

  if (role === "superAdmin"
      || role === "platformAdmin"
      || role === "admin"
      || role === "schoolAdmin"
      || role === "courseCreator"
      || role === "editor") {
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

function normalizeCourseAssignmentAdminRole(role) {
  var normalizedRole = typeof role === "string" ? role.replace(/[^a-z0-9]/gi, "").toLowerCase() : "";

  if (normalizedRole === "rolesuperadmin" || normalizedRole === "superadmin") {
    return "superAdmin";
  }

  if (normalizedRole === "roleplatformadmin" || normalizedRole === "platformadmin") {
    return "platformAdmin";
  }

  if (normalizedRole === "roleadmin" || normalizedRole === "admin") {
    return "admin";
  }

  if (normalizedRole === "roleschooladmin" || normalizedRole === "schooladmin") {
    return "schoolAdmin";
  }

  if (normalizedRole === "rolecoursecreator" || normalizedRole === "coursecreator") {
    return "courseCreator";
  }

  if (normalizedRole === "editor") {
    return "editor";
  }

  return "";
}
