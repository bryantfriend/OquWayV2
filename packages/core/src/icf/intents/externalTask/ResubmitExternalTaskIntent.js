import { validateAuthenticated, validateExternalTaskSubmitPayload } from "../../stages/validate/validators.js?v=1.1.117-student-identity-binding";
import { normalizeExternalTaskPayload } from "../../stages/normalize/normalizers.js?v=1.1.117-student-identity-binding";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { requireExternalTaskStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.117-student-identity-binding";
import { processResubmitExternalTask } from "../../stages/process/processors.js?v=1.1.117-student-identity-binding";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.117-student-identity-binding";

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
