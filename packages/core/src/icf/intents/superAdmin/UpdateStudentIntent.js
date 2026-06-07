import { validateAuthenticated, validateStudentUpdatePayload } from "../../stages/validate/validators.js?v=1.1.117-student-identity-binding";
import { normalizeStudentPayload } from "../../stages/normalize/normalizers.js?v=1.1.117-student-identity-binding";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.117-student-identity-binding";
import { processUpdateStudent } from "../../stages/process/processors.js?v=1.1.117-student-identity-binding";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.117-student-identity-binding";

export function UpdateStudentIntent() {
  return {
    type: "UpdateStudentIntent",
    validate: [validateAuthenticated, validateStudentUpdatePayload],
    normalize: [normalizeStudentPayload],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireSuperAdminAccess],
    process: [processUpdateStudent],
    emit: [emitIntentResult]
  };
}
