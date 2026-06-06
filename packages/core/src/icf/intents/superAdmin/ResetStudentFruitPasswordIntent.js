import { validateAuthenticated, validateFruitPasswordResetPayload } from "../../stages/validate/validators.js?v=1.1.109-student-assignment-status-fallback";
import { normalizeFruitPasswordResetPayload } from "../../stages/normalize/normalizers.js?v=1.1.109-student-assignment-status-fallback";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.109-student-assignment-status-fallback";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.109-student-assignment-status-fallback";
import { processResetStudentFruitPassword } from "../../stages/process/processors.js?v=1.1.109-student-assignment-status-fallback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.109-student-assignment-status-fallback";

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
