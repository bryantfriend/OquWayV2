import { validateAuthenticated, validateClassOwnershipPayload } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { normalizeClassOwnershipPayload } from "../../stages/normalize/normalizers.js?v=1.1.114-student-profile-rules";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { processLoadClassOwnership } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

export function LoadClassOwnershipIntent() {
  return {
    type: "LoadClassOwnershipIntent",
    validate: [validateAuthenticated, validateClassOwnershipPayload],
    normalize: [normalizeClassOwnershipPayload],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireCourseAssignmentAdminAuthorization],
    process: [processLoadClassOwnership],
    emit: [emitIntentResult]
  };
}
