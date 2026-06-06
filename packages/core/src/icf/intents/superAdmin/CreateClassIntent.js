import { validateAuthenticated, validateClassPayload } from "../../stages/validate/validators.js?v=1.1.107-student-firebase-auth-chain";
import { normalizeClassPayload } from "../../stages/normalize/normalizers.js?v=1.1.107-student-firebase-auth-chain";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.107-student-firebase-auth-chain";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.107-student-firebase-auth-chain";
import { processCreateClass } from "../../stages/process/processors.js?v=1.1.107-student-firebase-auth-chain";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.107-student-firebase-auth-chain";

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
