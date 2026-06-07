import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.112-student-assignment-error-debug";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.112-student-assignment-error-debug";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.112-student-assignment-error-debug";
import { processVerifySuperAdminAccess } from "../../stages/process/processors.js?v=1.1.112-student-assignment-error-debug";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.112-student-assignment-error-debug";

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
