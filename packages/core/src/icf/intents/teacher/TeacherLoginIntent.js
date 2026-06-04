import { validateTeacherLoginPayload } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { normalizeTeacherLoginPayload } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { allowTeacherLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { processTeacherLogin } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

export function TeacherLoginIntent() {
  return {
    type: "TeacherLoginIntent",
    validate: [validateTeacherLoginPayload],
    normalize: [normalizeTeacherLoginPayload],
    addContext: [],
    authorize: [allowTeacherLoginAuthorization],
    process: [processTeacherLogin],
    emit: [emitIntentResult]
  };
}


