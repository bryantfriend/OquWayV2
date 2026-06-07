import { validateAuthenticated, validateExternalTaskSubmissionsQuery } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { normalizeExternalTaskListPayload } from "../../stages/normalize/normalizers.js?v=1.1.114-student-profile-rules";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireExternalTaskReviewerAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { processLoadExternalTaskSubmissions } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

export function LoadExternalTaskSubmissionsIntent() {
  return {
    type: "LoadExternalTaskSubmissionsIntent",
    validate: [validateAuthenticated, validateExternalTaskSubmissionsQuery],
    normalize: [normalizeExternalTaskListPayload],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireExternalTaskReviewerAuthorization],
    process: [processLoadExternalTaskSubmissions],
    emit: [emitIntentResult]
  };
}
