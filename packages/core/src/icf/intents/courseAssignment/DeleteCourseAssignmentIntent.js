import { validateAuthenticated, validateCourseAssignmentId } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { normalizeCourseAssignmentUpdatePayload } from "../../stages/normalize/normalizers.js?v=1.1.62-external-task-review-loop";
import { attachActorContext, attachActorRoleContext, attachCourseAssignmentContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { processDeleteCourseAssignment } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

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
