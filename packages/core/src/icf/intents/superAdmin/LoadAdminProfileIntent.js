import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { processLoadAdminProfile } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

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
