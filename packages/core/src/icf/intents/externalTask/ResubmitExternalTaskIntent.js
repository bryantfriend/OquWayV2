import { validateAuthenticated, validateExternalTaskSubmitPayload } from "../../stages/validate/validators.js?v=1.1.70-external-task-feedback";
import { normalizeExternalTaskPayload } from "../../stages/normalize/normalizers.js?v=1.1.70-external-task-feedback";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.70-external-task-feedback";
import { requireExternalTaskStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.70-external-task-feedback";
import { processResubmitExternalTask } from "../../stages/process/processors.js?v=1.1.70-external-task-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.70-external-task-feedback";

export function ResubmitExternalTaskIntent() {
  return {
    type: "ResubmitExternalTaskIntent",
    validate: [validateAuthenticated, validateExternalTaskSubmitPayload],
    normalize: [normalizeExternalTaskPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachStudentProfileContext],
    authorize: [requireExternalTaskStudentAuthorization],
    process: [processResubmitExternalTask],
    emit: [emitIntentResult]
  };
}
