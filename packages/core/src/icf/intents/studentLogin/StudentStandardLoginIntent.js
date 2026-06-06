import { validateStudentStandardLoginPayload } from "../../stages/validate/validators.js?v=1.1.91-student-auth-persistence";
import { normalizeStudentStandardLoginPayload } from "../../stages/normalize/normalizers.js?v=1.1.91-student-auth-persistence";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.91-student-auth-persistence";
import { processStudentStandardLogin } from "../../stages/process/processors.js?v=1.1.91-student-auth-persistence";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.91-student-auth-persistence";

export function StudentStandardLoginIntent() {
  return {
    type: "StudentStandardLoginIntent",
    validate: [
      validateStudentStandardLoginPayload
    ],
    normalize: [
      normalizeStudentStandardLoginPayload
    ],
    addContext: [],
    authorize: [
      allowStudentLoginAuthorization
    ],
    process: [
      processStudentStandardLogin
    ],
    emit: [
      emitIntentResult
    ]
  };
}
