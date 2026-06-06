import { validateStudentsForClassPayload } from "../../stages/validate/validators.js?v=1.1.98-student-session-proof";
import { normalizeStudentsForClassPayload } from "../../stages/normalize/normalizers.js?v=1.1.98-student-session-proof";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.98-student-session-proof";
import { processLoadStudentsForClass } from "../../stages/process/processors.js?v=1.1.98-student-session-proof";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.98-student-session-proof";

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
