import { validateAuthenticated, validateCourseAssignmentId, validateCourseAssignmentUpdatePayload } from "../../stages/validate/validators.js?v=1.1.117-student-identity-binding";
import { normalizeCourseAssignmentUpdatePayload } from "../../stages/normalize/normalizers.js?v=1.1.117-student-identity-binding";
import { attachActorContext, attachActorRoleContext, attachCourseAssignmentContext } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.117-student-identity-binding";
import { processUpdateCourseAssignment } from "../../stages/process/processors.js?v=1.1.117-student-identity-binding";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.117-student-identity-binding";

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
