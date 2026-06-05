import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.61-assignment-ownership-read";
import { normalizeCourseAssignmentListPayload } from "../../stages/normalize/normalizers.js?v=1.1.61-assignment-ownership-read";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.61-assignment-ownership-read";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.61-assignment-ownership-read";
import { processLoadCourseAssignments } from "../../stages/process/processors.js?v=1.1.61-assignment-ownership-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.61-assignment-ownership-read";

export function LoadCourseAssignmentsIntent() {
  return {
    type: "LoadCourseAssignmentsIntent",
    validate: [
      validateAuthenticated
    ],
    normalize: [
      normalizeCourseAssignmentListPayload
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext
    ],
    authorize: [
      requireCourseAssignmentAdminAuthorization
    ],
    process: [
      processLoadCourseAssignments
    ],
    emit: [
      emitIntentResult
    ]
  };
}
