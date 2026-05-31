import { validateAuthenticated, validateExternalTaskSubmissionsQuery } from "../../stages/validate/validators.js";
import { normalizeExternalTaskListPayload } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { requireExternalTaskReviewerAuthorization } from "../../stages/authorize/authorizers.js";
import { processLoadExternalTaskSubmissions } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
