import { validateAuthenticated, validateStudentPayload } from "../../stages/validate/validators.js?v=1.1.79-user-command-center";
import { normalizeStudentPayload } from "../../stages/normalize/normalizers.js?v=1.1.79-user-command-center";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { processCreateStudent } from "../../stages/process/processors.js?v=1.1.79-user-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.79-user-command-center";

export function CreateStudentIntent() {
  return {
    type: "CreateStudentIntent",
    validate: [validateAuthenticated, validateStudentPayload],
    normalize: [normalizeStudentPayload],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireSuperAdminAccess],
    process: [processCreateStudent],
    emit: [emitIntentResult]
  };
}
