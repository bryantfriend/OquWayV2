import { validateAuthenticated, validateLocationUpdatePayload } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { normalizeLocationPayload } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { processUpdateLocation } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

export function UpdateLocationIntent() {
  return {
    type: "UpdateLocationIntent",
    validate: [validateAuthenticated, validateLocationUpdatePayload],
    normalize: [normalizeLocationPayload],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireSuperAdminAccess],
    process: [processUpdateLocation],
    emit: [emitIntentResult]
  };
}
