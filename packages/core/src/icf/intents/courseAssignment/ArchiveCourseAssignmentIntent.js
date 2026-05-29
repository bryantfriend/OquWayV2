import { validateAuthenticated, validateCourseAssignmentId } from "../../stages/validate/validators.js";
import { normalizeCourseAssignmentUpdatePayload } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext, attachCourseAssignmentContext } from "../../stages/addContext/contexts.js";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js";
import { processArchiveCourseAssignment } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function ArchiveCourseAssignmentIntent() {
  return {
    type: "ArchiveCourseAssignmentIntent",
    validate: [
      validateAuthenticated,
      validateCourseAssignmentId
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
      processArchiveCourseAssignment
    ],
    emit: [
      emitIntentResult
    ]
  };
}
