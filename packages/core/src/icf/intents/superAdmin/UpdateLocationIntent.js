import { validateAuthenticated, validateLocationUpdatePayload } from "../../stages/validate/validators.js";
import { normalizeLocationPayload } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js";
import { processUpdateLocation } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
