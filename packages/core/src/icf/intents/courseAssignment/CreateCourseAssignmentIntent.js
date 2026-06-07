import { validateAuthenticated, validateCourseAssignmentPayload } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { normalizeCourseAssignmentPayload } from "../../stages/normalize/normalizers.js?v=1.1.114-student-profile-rules";
import { attachActorContext, attachActorRoleContext, attachCourseAssignmentCourseContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { processCreateCourseAssignment } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

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
