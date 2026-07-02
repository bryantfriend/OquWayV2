import { validateTeacherPasswordResetPayload } from "../../stages/validate/validators.js?v=1.1.218-dashboard-calm-teacher-functional";
import { normalizeTeacherPasswordResetPayload } from "../../stages/normalize/normalizers.js?v=1.1.218-dashboard-calm-teacher-functional";
import { allowTeacherLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.218-dashboard-calm-teacher-functional";
import { processSendTeacherPasswordReset } from "../../stages/process/processors.js?v=1.1.218-dashboard-calm-teacher-functional";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.218-dashboard-calm-teacher-functional";

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


