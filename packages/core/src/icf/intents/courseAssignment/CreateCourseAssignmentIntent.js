import { validateAuthenticated, validateCourseAssignmentPayload } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { normalizeCourseAssignmentPayload } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext, attachActorRoleContext, attachCourseAssignmentCourseContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { processCreateCourseAssignment } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

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
