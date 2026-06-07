import { validateAuthenticated, validateExternalTaskUploadPayload } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { normalizeExternalTaskPayload } from "../../stages/normalize/normalizers.js?v=1.1.114-student-profile-rules";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireExternalTaskStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { processUploadExternalTaskFile } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

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
