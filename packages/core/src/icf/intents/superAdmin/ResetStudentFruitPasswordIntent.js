import { validateAuthenticated, validateFruitPasswordResetPayload } from "../../stages/validate/validators.js?v=1.1.113-student-rules-read";
import { normalizeFruitPasswordResetPayload } from "../../stages/normalize/normalizers.js?v=1.1.113-student-rules-read";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { processResetStudentFruitPassword } from "../../stages/process/processors.js?v=1.1.113-student-rules-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.113-student-rules-read";

export function ResetStudentFruitPasswordIntent() {
  return {
    type: "ResetStudentFruitPasswordIntent",
    validate: [validateAuthenticated, validateFruitPasswordResetPayload],
    normalize: [normalizeFruitPasswordResetPayload],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireSuperAdminAccess],
    process: [processResetStudentFruitPassword],
    emit: [emitIntentResult]
  };
}
