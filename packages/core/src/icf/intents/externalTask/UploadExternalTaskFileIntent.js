import { validateAuthenticated, validateExternalTaskUploadPayload } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { normalizeExternalTaskPayload } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireExternalTaskStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processUploadExternalTaskFile } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

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
