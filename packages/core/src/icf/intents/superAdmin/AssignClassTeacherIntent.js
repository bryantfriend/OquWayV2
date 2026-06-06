import { validateAuthenticated, validateClassOwnershipPayload } from "../../stages/validate/validators.js?v=1.1.81-class-command-center";
import { normalizeClassOwnershipPayload } from "../../stages/normalize/normalizers.js?v=1.1.81-class-command-center";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.81-class-command-center";
import { requireClassOwnershipAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.81-class-command-center";
import { processAssignClassTeacher } from "../../stages/process/processors.js?v=1.1.81-class-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.81-class-command-center";

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
