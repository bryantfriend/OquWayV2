import { validateStudentsForClassPayload } from "../../stages/validate/validators.js?v=1.1.113-student-rules-read";
import { normalizeStudentsForClassPayload } from "../../stages/normalize/normalizers.js?v=1.1.113-student-rules-read";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { processLoadStudentsForClass } from "../../stages/process/processors.js?v=1.1.113-student-rules-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.113-student-rules-read";

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
