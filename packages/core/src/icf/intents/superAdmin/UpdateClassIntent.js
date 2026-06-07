import { validateAuthenticated, validateClassUpdatePayload } from "../../stages/validate/validators.js?v=1.1.124-location-icon-upload";
import { normalizeClassPayload } from "../../stages/normalize/normalizers.js?v=1.1.124-location-icon-upload";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.124-location-icon-upload";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.124-location-icon-upload";
import { processUpdateClass } from "../../stages/process/processors.js?v=1.1.124-location-icon-upload";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.124-location-icon-upload";

export function UpdateClassIntent() {
  return {
    type: "UpdateClassIntent",
    validate: [validateAuthenticated, validateClassUpdatePayload],
    normalize: [normalizeClassPayload],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireSuperAdminAccess],
    process: [processUpdateClass],
    emit: [emitIntentResult]
  };
}
