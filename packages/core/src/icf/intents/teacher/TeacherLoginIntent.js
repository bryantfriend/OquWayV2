import { validateTeacherLoginPayload } from "../../stages/validate/validators.js?v=1.1.53-teacher-profile-auth";
import { normalizeTeacherLoginPayload } from "../../stages/normalize/normalizers.js?v=1.1.53-teacher-profile-auth";
import { allowTeacherLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.53-teacher-profile-auth";
import { processTeacherLogin } from "../../stages/process/processors.js?v=1.1.53-teacher-profile-auth";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.29-module-render-fix";

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


