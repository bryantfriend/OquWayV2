import { validateAuthenticated, validateFruitPasswordResetPayload } from "../../stages/validate/validators.js?v=1.1.111-student-assignment-debug-panel";
import { normalizeFruitPasswordResetPayload } from "../../stages/normalize/normalizers.js?v=1.1.111-student-assignment-debug-panel";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.111-student-assignment-debug-panel";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.111-student-assignment-debug-panel";
import { processResetStudentFruitPassword } from "../../stages/process/processors.js?v=1.1.111-student-assignment-debug-panel";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.111-student-assignment-debug-panel";

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
