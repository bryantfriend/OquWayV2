import { validateAuthenticated, validateLocationPayload } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { normalizeLocationPayload } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processCreateLocation } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

export function CreateLocationIntent() {
  return {
    type: "CreateLocationIntent",
    validate: [validateAuthenticated, validateLocationPayload],
    normalize: [normalizeLocationPayload],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireSuperAdminAccess],
    process: [processCreateLocation],
    emit: [emitIntentResult]
  };
}
