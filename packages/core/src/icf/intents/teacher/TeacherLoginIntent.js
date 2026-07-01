import { validateTeacherLoginPayload } from "../../stages/validate/validators.js?v=1.1.82-shared-command-center-shell";
import { normalizeTeacherLoginPayload } from "../../stages/normalize/normalizers.js?v=1.1.82-shared-command-center-shell";
import { allowTeacherLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.82-shared-command-center-shell";
import { processTeacherLogin } from "../../stages/process/processors.js?v=1.1.82-shared-command-center-shell";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.82-shared-command-center-shell";

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


