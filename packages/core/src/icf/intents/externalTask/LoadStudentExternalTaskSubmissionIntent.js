import { validateAuthenticated, validateExternalTaskStepPayload } from "../../stages/validate/validators.js?v=1.1.120-student-course-debug-summary";
import { normalizeExternalTaskListPayload } from "../../stages/normalize/normalizers.js?v=1.1.120-student-course-debug-summary";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.120-student-course-debug-summary";
import { requireExternalTaskStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.120-student-course-debug-summary";
import { processLoadExternalTaskStep } from "../../stages/process/processors.js?v=1.1.120-student-course-debug-summary";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.120-student-course-debug-summary";

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
