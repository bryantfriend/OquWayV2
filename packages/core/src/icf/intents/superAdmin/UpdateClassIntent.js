import { validateAuthenticated, validateClassUpdatePayload } from "../../stages/validate/validators.js?v=1.1.111-student-assignment-debug-panel";
import { normalizeClassPayload } from "../../stages/normalize/normalizers.js?v=1.1.111-student-assignment-debug-panel";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.111-student-assignment-debug-panel";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.111-student-assignment-debug-panel";
import { processUpdateClass } from "../../stages/process/processors.js?v=1.1.111-student-assignment-debug-panel";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.111-student-assignment-debug-panel";

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
