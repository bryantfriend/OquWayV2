import { validateAuthenticated, validateExternalTaskStepPayload } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { normalizeExternalTaskListPayload } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireExternalTaskStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { processLoadExternalTaskStep } from "../../stages/process/processors.js?v=1.1.34-external-task-mvp";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

export function LoadExternalTaskStepIntent() {
  return {
    type: "LoadExternalTaskStepIntent",
    validate: [validateAuthenticated, validateExternalTaskStepPayload],
    normalize: [normalizeExternalTaskListPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachStudentProfileContext],
    authorize: [requireExternalTaskStudentAuthorization],
    process: [processLoadExternalTaskStep],
    emit: [emitIntentResult]
  };
}
