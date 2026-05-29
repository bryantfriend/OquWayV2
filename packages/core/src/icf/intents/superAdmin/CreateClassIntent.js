import { validateAuthenticated, validateClassPayload } from "../../stages/validate/validators.js";
import { normalizeClassPayload } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js";
import { processCreateClass } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function CreateClassIntent() {
  return {
    type: "CreateClassIntent",
    validate: [validateAuthenticated, validateClassPayload],
    normalize: [normalizeClassPayload],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireSuperAdminAccess],
    process: [processCreateClass],
    emit: [emitIntentResult]
  };
}
