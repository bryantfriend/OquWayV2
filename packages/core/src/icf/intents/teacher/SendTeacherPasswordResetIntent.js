import { validateTeacherPasswordResetPayload } from "../../stages/validate/validators.js?v=1.1.40-teacher-profile-admin-fix";
import { normalizeTeacherPasswordResetPayload } from "../../stages/normalize/normalizers.js?v=1.1.40-teacher-profile-admin-fix";
import { allowTeacherLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.40-teacher-profile-admin-fix";
import { processSendTeacherPasswordReset } from "../../stages/process/processors.js?v=1.1.40-teacher-profile-admin-fix";
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

