import { validateStudentsForClassPayload } from "../../stages/validate/validators.js?v=1.1.89-student-fruit-session";
import { normalizeStudentsForClassPayload } from "../../stages/normalize/normalizers.js?v=1.1.89-student-fruit-session";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.89-student-fruit-session";
import { processLoadStudentsForClass } from "../../stages/process/processors.js?v=1.1.89-student-fruit-session";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.89-student-fruit-session";

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
