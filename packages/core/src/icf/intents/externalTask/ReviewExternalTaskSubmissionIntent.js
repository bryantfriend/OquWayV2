import { validateAuthenticated, validateExternalTaskReviewPayload } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { normalizeExternalTaskReviewPayload } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { attachActorContext, attachActorRoleContext, attachExternalTaskSubmissionReviewContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireTeacherReviewScopeAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processReviewExternalTaskSubmission } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

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


