import { validateAuthenticated, validateStudentStatusPayload } from "../../stages/validate/validators.js";
import { normalizeStudentPayload } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js";
import { processSetStudentStatus } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function SetStudentStatusIntent() {
  return {
    type: "SetStudentStatusIntent",
    validate: [validateAuthenticated, validateStudentStatusPayload],
    normalize: [normalizeStudentPayload],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireSuperAdminAccess],
    process: [processSetStudentStatus],
    emit: [emitIntentResult]
  };
}
