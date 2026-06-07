import { validateAuthenticated, validateCourseAssignmentOwnershipPayload } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { normalizeCourseAssignmentOwnershipPayload } from "../../stages/normalize/normalizers.js?v=1.1.114-student-profile-rules";
import { attachActorContext, attachActorRoleContext, attachCourseAssignmentContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireCourseAssignmentOwnershipReadAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { processLoadCourseAssignmentOwnership } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

export function LoadCourseAssignmentOwnershipIntent() {
  return {
    type: "LoadCourseAssignmentOwnershipIntent",
    validate: [validateAuthenticated, validateCourseAssignmentOwnershipPayload],
    normalize: [normalizeCourseAssignmentOwnershipPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseAssignmentContext],
    authorize: [requireCourseAssignmentOwnershipReadAuthorization],
    process: [processLoadCourseAssignmentOwnership],
    emit: [emitIntentResult]
  };
}
