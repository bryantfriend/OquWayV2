import { validateAuthenticated, validateExternalTaskUploadPayload } from "../../stages/validate/validators.js?v=1.1.123-teacher-dashboard-query-optimization";
import { normalizeExternalTaskPayload } from "../../stages/normalize/normalizers.js?v=1.1.123-teacher-dashboard-query-optimization";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.123-teacher-dashboard-query-optimization";
import { requireExternalTaskStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.123-teacher-dashboard-query-optimization";
import { processUploadExternalTaskFile } from "../../stages/process/processors.js?v=1.1.123-teacher-dashboard-query-optimization";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.123-teacher-dashboard-query-optimization";

export function UploadExternalTaskFileIntent() {
  return {
    type: "UploadExternalTaskFileIntent",
    validate: [validateAuthenticated, validateExternalTaskUploadPayload],
    normalize: [normalizeExternalTaskPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachStudentProfileContext],
    authorize: [requireExternalTaskStudentAuthorization],
    process: [processUploadExternalTaskFile],
    emit: [emitIntentResult]
  };
}
