import { validateTeacherPasswordResetPayload } from "../../stages/validate/validators.js?v=1.1.36-teacher-auth";
import { normalizeTeacherPasswordResetPayload } from "../../stages/normalize/normalizers.js?v=1.1.36-teacher-auth";
import { allowTeacherLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.36-teacher-auth";
import { processSendTeacherPasswordReset } from "../../stages/process/processors.js?v=1.1.36-teacher-auth";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.29-module-render-fix";

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
