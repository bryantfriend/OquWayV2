import { validateAuthenticated, validateExternalTaskStepPayload } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { normalizeExternalTaskListPayload } from "../../stages/normalize/normalizers.js?v=1.1.114-student-profile-rules";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireExternalTaskStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { processLoadExternalTaskStep } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

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
