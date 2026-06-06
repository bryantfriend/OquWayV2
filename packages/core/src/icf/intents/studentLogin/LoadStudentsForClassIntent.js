import { validateStudentsForClassPayload } from "../../stages/validate/validators.js?v=1.1.91-student-auth-persistence";
import { normalizeStudentsForClassPayload } from "../../stages/normalize/normalizers.js?v=1.1.91-student-auth-persistence";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.91-student-auth-persistence";
import { processLoadStudentsForClass } from "../../stages/process/processors.js?v=1.1.91-student-auth-persistence";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.91-student-auth-persistence";

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
