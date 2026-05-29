import { validateAuthenticated, validateStudentPayload } from "../../stages/validate/validators.js";
import { normalizeStudentPayload } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js";
import { processCreateStudent } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
