import { validateTeacherPasswordResetPayload } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { normalizeTeacherPasswordResetPayload } from "../../stages/normalize/normalizers.js?v=1.1.114-student-profile-rules";
import { allowTeacherLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { processSendTeacherPasswordReset } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

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


