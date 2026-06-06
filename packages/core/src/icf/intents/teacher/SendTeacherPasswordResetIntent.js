import { validateTeacherPasswordResetPayload } from "../../stages/validate/validators.js?v=1.1.82-shared-command-center-shell";
import { normalizeTeacherPasswordResetPayload } from "../../stages/normalize/normalizers.js?v=1.1.82-shared-command-center-shell";
import { allowTeacherLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.82-shared-command-center-shell";
import { processSendTeacherPasswordReset } from "../../stages/process/processors.js?v=1.1.82-shared-command-center-shell";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.82-shared-command-center-shell";

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


