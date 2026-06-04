import { validateAuthenticated, validateExternalTaskSubmitPayload } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { normalizeExternalTaskPayload } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireExternalTaskStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { processSubmitExternalTask } from "../../stages/process/processors.js?v=1.1.34-external-task-mvp";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

export function SubmitExternalTaskIntent() {
  return {
    type: "SubmitExternalTaskIntent",
    validate: [validateAuthenticated, validateExternalTaskSubmitPayload],
    normalize: [normalizeExternalTaskPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachStudentProfileContext],
    authorize: [requireExternalTaskStudentAuthorization],
    process: [processSubmitExternalTask],
    emit: [emitIntentResult]
  };
}
