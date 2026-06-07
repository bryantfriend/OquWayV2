import { validateAuthenticated, validateStudentStatusPayload } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { normalizeStudentPayload } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processSetStudentStatus } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

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
