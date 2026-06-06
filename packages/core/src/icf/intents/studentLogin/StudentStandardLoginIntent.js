import { validateStudentStandardLoginPayload } from "../../stages/validate/validators.js?v=1.1.94-student-profile-context";
import { normalizeStudentStandardLoginPayload } from "../../stages/normalize/normalizers.js?v=1.1.94-student-profile-context";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.94-student-profile-context";
import { processStudentStandardLogin } from "../../stages/process/processors.js?v=1.1.94-student-profile-context";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.94-student-profile-context";

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
