import { hasAnyRole } from "../../core/roleAuthorization.js?v=1.1.162-modal-stack";

export function requireCourseAssignmentOwnershipAuthorization(executionState) {
  var actor = executionState.actor;

  if (hasAnyRole(actor, ["superAdmin", "platformAdmin", "schoolAdmin"])) {
    return { valid: true };
  }

  return {
    valid: false,
    errors: [
      {
        code: "COURSE_ASSIGNMENT_OWNERSHIP_ADMIN_REQUIRED",
        message: "Only school admins, platform admins, or super admins can manage course assignment ownership."
      }
    ]
  };
}
