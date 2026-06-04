import { validateAuthenticated, validateClassOwnershipPayload } from "../../stages/validate/validators.js?v=1.1.55-class-ownership";
import { normalizeClassOwnershipPayload } from "../../stages/normalize/normalizers.js?v=1.1.55-class-ownership";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.55-class-ownership";
import { requireClassOwnershipAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.55-class-ownership";
import { processAssignClassAssistants } from "../../stages/process/processors.js?v=1.1.55-class-ownership";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.55-class-ownership";

export function AssignClassAssistantsIntent() {
  return {
    type: "AssignClassAssistantsIntent",
    validate: [validateAuthenticated, validateClassOwnershipPayload],
    normalize: [normalizeClassOwnershipPayload],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireClassOwnershipAdminAuthorization],
    process: [processAssignClassAssistants],
    emit: [emitIntentResult]
  };
}
