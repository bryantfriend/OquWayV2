import { validateAuthenticated, validateClassPayload } from "../../stages/validate/validators.js?v=1.1.118-fruit-login-student-identity";
import { normalizeClassPayload } from "../../stages/normalize/normalizers.js?v=1.1.118-fruit-login-student-identity";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.118-fruit-login-student-identity";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.118-fruit-login-student-identity";
import { processCreateClass } from "../../stages/process/processors.js?v=1.1.118-fruit-login-student-identity";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.118-fruit-login-student-identity";

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
