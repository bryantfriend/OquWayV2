import { validateAuthenticated, validateCourseAssignmentId } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { normalizeCourseAssignmentDisablePayload } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext, attachActorRoleContext, attachCourseAssignmentContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { processDisableCourseAssignment } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

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
