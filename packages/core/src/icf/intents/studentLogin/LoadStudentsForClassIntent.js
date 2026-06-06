import { validateStudentsForClassPayload } from "../../stages/validate/validators.js?v=1.1.96-student-session-profile";
import { normalizeStudentsForClassPayload } from "../../stages/normalize/normalizers.js?v=1.1.96-student-session-profile";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.96-student-session-profile";
import { processLoadStudentsForClass } from "../../stages/process/processors.js?v=1.1.96-student-session-profile";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.96-student-session-profile";

export function LoadStudentsForClassIntent() {
  return {
    type: "LoadStudentsForClassIntent",
    validate: [
      validateStudentsForClassPayload
    ],
    normalize: [
      normalizeStudentsForClassPayload
    ],
    addContext: [],
    authorize: [
      allowStudentLoginAuthorization
    ],
    process: [
      processLoadStudentsForClass
    ],
    emit: [
      emitIntentResult
    ]
  };
}
