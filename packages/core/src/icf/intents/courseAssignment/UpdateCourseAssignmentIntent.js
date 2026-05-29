import { validateAuthenticated, validateCourseAssignmentId, validateCourseAssignmentUpdatePayload } from "../../stages/validate/validators.js";
import { normalizeCourseAssignmentUpdatePayload } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext, attachCourseAssignmentContext } from "../../stages/addContext/contexts.js";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js";
import { processUpdateCourseAssignment } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
