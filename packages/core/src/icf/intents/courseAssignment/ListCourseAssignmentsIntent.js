import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.113-student-rules-read";
import { normalizeCourseAssignmentListPayload } from "../../stages/normalize/normalizers.js?v=1.1.113-student-rules-read";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { processListCourseAssignments } from "../../stages/process/processors.js?v=1.1.113-student-rules-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.113-student-rules-read";

export function ListCourseAssignmentsIntent() {
  return {
    type: "ListCourseAssignmentsIntent",
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
      processListCourseAssignments
    ],
    emit: [
      emitIntentResult
    ]
  };
}
