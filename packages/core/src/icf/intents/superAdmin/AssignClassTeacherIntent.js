import { validateAuthenticated, validateClassOwnershipPayload } from "../../stages/validate/validators.js?v=1.1.55-class-ownership";
import { normalizeClassOwnershipPayload } from "../../stages/normalize/normalizers.js?v=1.1.55-class-ownership";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.55-class-ownership";
import { requireClassOwnershipAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.55-class-ownership";
import { processAssignClassTeacher } from "../../stages/process/processors.js?v=1.1.55-class-ownership";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.55-class-ownership";

export function AssignClassTeacherIntent() {
  return {
    type: "AssignClassTeacherIntent",
    validate: [validateAuthenticated, validateClassOwnershipPayload],
    normalize: [normalizeClassOwnershipPayload],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireClassOwnershipAdminAuthorization],
    process: [processAssignClassTeacher],
    emit: [emitIntentResult]
  };
}
