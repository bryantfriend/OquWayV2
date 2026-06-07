import { validateAuthenticated, validateExternalTaskSubmissionsQuery } from "../../stages/validate/validators.js?v=1.1.123-teacher-dashboard-query-optimization";
import { normalizeExternalTaskListPayload } from "../../stages/normalize/normalizers.js?v=1.1.123-teacher-dashboard-query-optimization";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.123-teacher-dashboard-query-optimization";
import { requireExternalTaskReviewerAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.123-teacher-dashboard-query-optimization";
import { processLoadExternalTaskSubmissions } from "../../stages/process/processors.js?v=1.1.123-teacher-dashboard-query-optimization";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.123-teacher-dashboard-query-optimization";

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
