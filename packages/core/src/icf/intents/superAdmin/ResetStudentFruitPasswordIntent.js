import { validateAuthenticated, validateFruitPasswordResetPayload } from "../../stages/validate/validators.js";
import { normalizeFruitPasswordResetPayload } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js";
import { processResetStudentFruitPassword } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
