import { validateAuthenticated, validateExternalTaskStepPayload } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { normalizeExternalTaskListPayload } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireExternalTaskStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processLoadExternalTaskStep } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

export function LoadExternalTaskStepIntent() {
  return {
    type: "LoadExternalTaskStepIntent",
    validate: [validateAuthenticated, validateExternalTaskStepPayload],
    normalize: [normalizeExternalTaskListPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachStudentProfileContext],
    authorize: [requireExternalTaskStudentAuthorization],
    process: [processLoadExternalTaskStep],
    emit: [emitIntentResult]
  };
}
