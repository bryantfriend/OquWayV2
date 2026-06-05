import { validateAuthenticated, validateCourseAssignmentPayload } from "../../stages/validate/validators.js?v=1.1.61-assignment-ownership-read";
import { normalizeCourseAssignmentPayload } from "../../stages/normalize/normalizers.js?v=1.1.61-assignment-ownership-read";
import { attachActorContext, attachActorRoleContext, attachCourseAssignmentCourseContext } from "../../stages/addContext/contexts.js?v=1.1.61-assignment-ownership-read";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.61-assignment-ownership-read";
import { processCreateCourseAssignment } from "../../stages/process/processors.js?v=1.1.61-assignment-ownership-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.61-assignment-ownership-read";

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
