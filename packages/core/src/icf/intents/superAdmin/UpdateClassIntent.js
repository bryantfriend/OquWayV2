import { validateAuthenticated, validateClassUpdatePayload } from "../../stages/validate/validators.js?v=1.1.119-student-dashboard-debug-safe";
import { normalizeClassPayload } from "../../stages/normalize/normalizers.js?v=1.1.119-student-dashboard-debug-safe";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.119-student-dashboard-debug-safe";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.119-student-dashboard-debug-safe";
import { processUpdateClass } from "../../stages/process/processors.js?v=1.1.119-student-dashboard-debug-safe";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.119-student-dashboard-debug-safe";

export function UpdateClassIntent() {
  return {
    type: "UpdateClassIntent",
    validate: [validateAuthenticated, validateClassUpdatePayload],
    normalize: [normalizeClassPayload],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireSuperAdminAccess],
    process: [processUpdateClass],
    emit: [emitIntentResult]
  };
}
