import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.117-student-identity-binding";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.117-student-identity-binding";
import { processVerifySuperAdminAccess } from "../../stages/process/processors.js?v=1.1.117-student-identity-binding";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.117-student-identity-binding";

export function VerifySuperAdminAccessIntent() {
  return {
    type: "VerifySuperAdminAccessIntent",
    validate: [validateAuthenticated],
    normalize: [],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireSuperAdminAccess],
    process: [processVerifySuperAdminAccess],
    emit: [emitIntentResult]
  };
}
