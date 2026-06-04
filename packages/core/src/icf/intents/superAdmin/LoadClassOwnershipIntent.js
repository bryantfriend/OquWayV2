import { validateAuthenticated, validateClassOwnershipPayload } from "../../stages/validate/validators.js?v=1.1.55-class-ownership";
import { normalizeClassOwnershipPayload } from "../../stages/normalize/normalizers.js?v=1.1.55-class-ownership";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.55-class-ownership";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.55-class-ownership";
import { processLoadClassOwnership } from "../../stages/process/processors.js?v=1.1.55-class-ownership";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.55-class-ownership";

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
