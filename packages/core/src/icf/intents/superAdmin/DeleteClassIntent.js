import { validateAuthenticated, validateClassDeletePayload } from "../../stages/validate/validators.js?v=1.1.82-shared-command-center-shell";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.82-shared-command-center-shell";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.82-shared-command-center-shell";
import { processDeleteClass } from "../../stages/process/processors.js?v=1.1.82-shared-command-center-shell";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.82-shared-command-center-shell";

export function DeleteClassIntent() {
  return {
    type: "DeleteClassIntent",
    validate: [validateAuthenticated, validateClassDeletePayload],
    normalize: [],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireSuperAdminAccess],
    process: [processDeleteClass],
    emit: [emitIntentResult]
  };
}
