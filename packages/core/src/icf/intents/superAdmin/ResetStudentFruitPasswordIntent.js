import { validateAuthenticated, validateFruitPasswordResetPayload } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { normalizeFruitPasswordResetPayload } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { processResetStudentFruitPassword } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

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
