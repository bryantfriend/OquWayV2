import { validateAuthenticated, validateClassOwnershipPayload } from "../../stages/validate/validators.js?v=1.1.79-user-command-center";
import { normalizeClassOwnershipPayload } from "../../stages/normalize/normalizers.js?v=1.1.79-user-command-center";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { processLoadClassOwnership } from "../../stages/process/processors.js?v=1.1.79-user-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.79-user-command-center";

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
