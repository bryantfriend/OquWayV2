import { validateAuthenticated, validateClassOwnershipPayload } from "../../stages/validate/validators.js?v=1.1.78-location-command-center";
import { normalizeClassOwnershipPayload } from "../../stages/normalize/normalizers.js?v=1.1.78-location-command-center";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.78-location-command-center";
import { requireClassOwnershipAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.78-location-command-center";
import { processAssignClassAssistants } from "../../stages/process/processors.js?v=1.1.78-location-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.78-location-command-center";

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
