import { validateAuthenticated, validateCourseAssignmentId } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { normalizeCourseAssignmentDisablePayload } from "../../stages/normalize/normalizers.js?v=1.1.114-student-profile-rules";
import { attachActorContext, attachActorRoleContext, attachCourseAssignmentContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { processDisableCourseAssignment } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

export function DisableCourseAssignmentIntent() {
  return {
    type: "DisableCourseAssignmentIntent",
    validate: [
      validateAuthenticated,
      validateCourseAssignmentId
    ],
    normalize: [
      normalizeCourseAssignmentDisablePayload
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachCourseAssignmentContext
    ],
    authorize: [
      requireCourseAssignmentAdminAuthorization
    ],
    process: [
      processDisableCourseAssignment
    ],
    emit: [
      emitIntentResult
    ]
  };
}
