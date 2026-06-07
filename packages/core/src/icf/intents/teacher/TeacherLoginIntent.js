import { validateTeacherLoginPayload } from "../../stages/validate/validators.js?v=1.1.124-location-icon-upload";
import { normalizeTeacherLoginPayload } from "../../stages/normalize/normalizers.js?v=1.1.124-location-icon-upload";
import { allowTeacherLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.124-location-icon-upload";
import { processTeacherLogin } from "../../stages/process/processors.js?v=1.1.124-location-icon-upload";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.124-location-icon-upload";

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


