import { validateAuthenticated, validateExternalTaskStepPayload } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { normalizeExternalTaskListPayload } from "../../stages/normalize/normalizers.js?v=1.1.62-external-task-review-loop";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireExternalTaskStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { processLoadExternalTaskStep } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

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
