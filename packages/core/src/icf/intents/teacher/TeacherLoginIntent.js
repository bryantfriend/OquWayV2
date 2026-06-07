import { validateTeacherLoginPayload } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { normalizeTeacherLoginPayload } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { allowTeacherLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processTeacherLogin } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

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


