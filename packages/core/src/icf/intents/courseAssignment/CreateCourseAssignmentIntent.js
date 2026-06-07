import { validateAuthenticated, validateCourseAssignmentPayload } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { normalizeCourseAssignmentPayload } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { attachActorContext, attachActorRoleContext, attachCourseAssignmentCourseContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processCreateCourseAssignment } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

export function CreateCourseAssignmentIntent() {
  return {
    type: "CreateCourseAssignmentIntent",
    validate: [
      validateAuthenticated,
      validateCourseAssignmentPayload
    ],
    normalize: [
      normalizeCourseAssignmentPayload
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachCourseAssignmentCourseContext
    ],
    authorize: [
      requireCourseAssignmentAdminAuthorization
    ],
    process: [
      processCreateCourseAssignment
    ],
    emit: [
      emitIntentResult
    ]
  };
}
