import { validateAuthenticated, validateExternalTaskSubmissionsQuery } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { normalizeExternalTaskListPayload } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireExternalTaskReviewerAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { processLoadExternalTaskSubmissions } from "../../stages/process/processors.js?v=1.1.34-external-task-mvp";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

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
