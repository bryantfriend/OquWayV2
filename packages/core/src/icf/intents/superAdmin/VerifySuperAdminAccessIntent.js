import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.118-fruit-login-student-identity";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.118-fruit-login-student-identity";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.118-fruit-login-student-identity";
import { processVerifySuperAdminAccess } from "../../stages/process/processors.js?v=1.1.118-fruit-login-student-identity";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.118-fruit-login-student-identity";

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
