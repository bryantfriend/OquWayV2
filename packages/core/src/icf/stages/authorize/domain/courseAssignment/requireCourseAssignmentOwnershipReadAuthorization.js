import { hasAnyRole } from "../../core/roleAuthorization.js?v=1.1.116-student-token-ready";

export function requireCourseAssignmentOwnershipReadAuthorization(executionState) {
  var actor = executionState.actor;

  if (hasAnyRole(actor, ["superAdmin", "platformAdmin", "schoolAdmin", "teacher", "assistant", "courseCreator"])) {
    return { valid: true };
  }

  return {
    valid: false,
    errors: [
      {
        code: "COURSE_ASSIGNMENT_OWNERSHIP_READ_DENIED",
        message: "A teacher or admin role is required to read course assignment ownership."
      }
    ]
  };
}
