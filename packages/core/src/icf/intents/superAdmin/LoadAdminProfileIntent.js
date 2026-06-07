import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.121-student-dashboard-open-clean";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.121-student-dashboard-open-clean";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.121-student-dashboard-open-clean";
import { processLoadAdminProfile } from "../../stages/process/processors.js?v=1.1.121-student-dashboard-open-clean";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.121-student-dashboard-open-clean";

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
