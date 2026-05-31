import { validateAuthenticated, validateExternalTaskSubmitPayload } from "../../stages/validate/validators.js";
import { normalizeExternalTaskPayload } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js";
import { requireExternalTaskStudentAuthorization } from "../../stages/authorize/authorizers.js";
import { processResubmitExternalTask } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
