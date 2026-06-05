import { validateAuthenticated, validateCourseAssignmentId, validateCourseAssignmentUpdatePayload } from "../../stages/validate/validators.js?v=1.1.78-location-command-center";
import { normalizeCourseAssignmentUpdatePayload } from "../../stages/normalize/normalizers.js?v=1.1.78-location-command-center";
import { attachActorContext, attachActorRoleContext, attachCourseAssignmentContext } from "../../stages/addContext/contexts.js?v=1.1.78-location-command-center";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.78-location-command-center";
import { processUpdateCourseAssignment } from "../../stages/process/processors.js?v=1.1.78-location-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.78-location-command-center";

export function UpdateCourseAssignmentIntent() {
  return {
    type: "UpdateCourseAssignmentIntent",
    validate: [
      validateAuthenticated,
      validateCourseAssignmentId,
      validateCourseAssignmentUpdatePayload
    ],
    normalize: [
      normalizeCourseAssignmentUpdatePayload
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
      processUpdateCourseAssignment
    ],
    emit: [
      emitIntentResult
    ]
  };
}
