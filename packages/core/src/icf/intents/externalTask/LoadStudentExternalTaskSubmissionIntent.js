import { validateAuthenticated, validateExternalTaskStepPayload } from "../../stages/validate/validators.js?v=1.1.70-external-task-feedback";
import { normalizeExternalTaskListPayload } from "../../stages/normalize/normalizers.js?v=1.1.70-external-task-feedback";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.70-external-task-feedback";
import { requireExternalTaskStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.70-external-task-feedback";
import { processLoadExternalTaskStep } from "../../stages/process/processors.js?v=1.1.70-external-task-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.70-external-task-feedback";

export function LoadStudentExternalTaskSubmissionIntent() {
  return {
    type: "LoadStudentExternalTaskSubmissionIntent",
    validate: [validateAuthenticated, validateExternalTaskStepPayload],
    normalize: [normalizeExternalTaskListPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachStudentProfileContext],
    authorize: [requireExternalTaskStudentAuthorization],
    process: [processLoadExternalTaskStep],
    emit: [emitIntentResult]
  };
}
