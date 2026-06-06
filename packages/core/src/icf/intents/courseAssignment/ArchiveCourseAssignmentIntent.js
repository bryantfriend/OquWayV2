import { validateAuthenticated, validateCourseAssignmentId } from "../../stages/validate/validators.js?v=1.1.109-student-assignment-status-fallback";
import { normalizeCourseAssignmentUpdatePayload } from "../../stages/normalize/normalizers.js?v=1.1.109-student-assignment-status-fallback";
import { attachActorContext, attachActorRoleContext, attachCourseAssignmentContext } from "../../stages/addContext/contexts.js?v=1.1.109-student-assignment-status-fallback";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.109-student-assignment-status-fallback";
import { processArchiveCourseAssignment } from "../../stages/process/processors.js?v=1.1.109-student-assignment-status-fallback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.109-student-assignment-status-fallback";

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
