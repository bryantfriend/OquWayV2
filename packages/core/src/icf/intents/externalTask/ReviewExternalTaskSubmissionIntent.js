import { validateAuthenticated, validateExternalTaskReviewPayload } from "../../stages/validate/validators.js?v=1.1.29-module-render-fix";
import { normalizeExternalTaskReviewPayload } from "../../stages/normalize/normalizers.js?v=1.1.29-module-render-fix";
import { attachActorContext, attachActorRoleContext, attachExternalTaskSubmissionReviewContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.35-teacher-dashboard";
import { requireTeacherReviewScopeAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.35-teacher-dashboard";
import { processReviewExternalTaskSubmission } from "../../stages/process/processors.js?v=1.1.34-external-task-mvp";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.29-module-render-fix";

export function ReviewExternalTaskSubmissionIntent() {
  return {
    type: "ReviewExternalTaskSubmissionIntent",
    validate: [validateAuthenticated, validateExternalTaskReviewPayload],
    normalize: [normalizeExternalTaskReviewPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachTeacherProfileContext, attachExternalTaskSubmissionReviewContext],
    authorize: [requireTeacherReviewScopeAuthorization],
    process: [processReviewExternalTaskSubmission],
    emit: [emitIntentResult]
  };
}
