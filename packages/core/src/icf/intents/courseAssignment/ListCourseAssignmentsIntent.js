import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.107-student-firebase-auth-chain";
import { normalizeCourseAssignmentListPayload } from "../../stages/normalize/normalizers.js?v=1.1.107-student-firebase-auth-chain";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.107-student-firebase-auth-chain";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.107-student-firebase-auth-chain";
import { processListCourseAssignments } from "../../stages/process/processors.js?v=1.1.107-student-firebase-auth-chain";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.107-student-firebase-auth-chain";

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
