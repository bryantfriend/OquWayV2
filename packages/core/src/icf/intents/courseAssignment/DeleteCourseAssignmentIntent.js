import { validateAuthenticated, validateCourseAssignmentId } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { normalizeCourseAssignmentUpdatePayload } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { attachActorContext, attachActorRoleContext, attachCourseAssignmentContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processDeleteCourseAssignment } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

export function DeleteCourseAssignmentIntent() {
  return {
    type: "DeleteCourseAssignmentIntent",
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
      processDeleteCourseAssignment
    ],
    emit: [
      emitIntentResult
    ]
  };
}
