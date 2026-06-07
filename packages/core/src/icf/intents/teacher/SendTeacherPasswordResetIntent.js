import { validateTeacherPasswordResetPayload } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { normalizeTeacherPasswordResetPayload } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { allowTeacherLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processSendTeacherPasswordReset } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

export function SendTeacherPasswordResetIntent() {
  return {
    type: "SendTeacherPasswordResetIntent",
    validate: [validateTeacherPasswordResetPayload],
    normalize: [normalizeTeacherPasswordResetPayload],
    addContext: [],
    authorize: [allowTeacherLoginAuthorization],
    process: [processSendTeacherPasswordReset],
    emit: [emitIntentResult]
  };
}


