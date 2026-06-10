import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.162-modal-stack";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.162-modal-stack";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.162-modal-stack";
import { processLoadAdminProfile } from "../../stages/process/processors.js?v=1.1.162-modal-stack";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.162-modal-stack";

export function LoadAdminProfileIntent() {
  return {
    type: "LoadAdminProfileIntent",
    validate: [validateAuthenticated],
    normalize: [],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireSuperAdminAccess],
    process: [processLoadAdminProfile],
    emit: [emitIntentResult]
  };
}
