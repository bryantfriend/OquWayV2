import { validateAuthenticated, validateClassUpdatePayload } from "../../stages/validate/validators.js?v=1.1.79-user-command-center";
import { normalizeClassPayload } from "../../stages/normalize/normalizers.js?v=1.1.79-user-command-center";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { processUpdateClass } from "../../stages/process/processors.js?v=1.1.79-user-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.79-user-command-center";

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
