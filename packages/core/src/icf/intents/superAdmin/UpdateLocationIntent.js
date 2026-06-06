import { validateAuthenticated, validateLocationUpdatePayload } from "../../stages/validate/validators.js?v=1.1.81-class-command-center";
import { normalizeLocationPayload } from "../../stages/normalize/normalizers.js?v=1.1.81-class-command-center";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.81-class-command-center";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.81-class-command-center";
import { processUpdateLocation } from "../../stages/process/processors.js?v=1.1.81-class-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.81-class-command-center";

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
