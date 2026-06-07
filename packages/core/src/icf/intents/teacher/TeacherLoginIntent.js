import { validateTeacherLoginPayload } from "../../stages/validate/validators.js?v=1.1.113-student-rules-read";
import { normalizeTeacherLoginPayload } from "../../stages/normalize/normalizers.js?v=1.1.113-student-rules-read";
import { allowTeacherLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { processTeacherLogin } from "../../stages/process/processors.js?v=1.1.113-student-rules-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.113-student-rules-read";

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


