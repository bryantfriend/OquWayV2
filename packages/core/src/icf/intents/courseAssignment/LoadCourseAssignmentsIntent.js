import { validateAuthenticated } from "../../stages/validate/validators.js";
import { normalizeCourseAssignmentListPayload } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js";
import { processLoadCourseAssignments } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
