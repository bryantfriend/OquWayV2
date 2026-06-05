import { validateAuthenticated, validateExternalTaskReviewPayload } from "../../stages/validate/validators.js?v=1.1.63-external-task-student-feedback";
import { normalizeExternalTaskReviewPayload } from "../../stages/normalize/normalizers.js?v=1.1.63-external-task-student-feedback";
import { attachActorContext, attachActorRoleContext, attachExternalTaskSubmissionReviewContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { requireTeacherReviewScopeAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { processReviewExternalTaskSubmission } from "../../stages/process/processors.js?v=1.1.63-external-task-student-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.63-external-task-student-feedback";

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


