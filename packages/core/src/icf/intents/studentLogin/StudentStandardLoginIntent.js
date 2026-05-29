import { validateStudentStandardLoginPayload } from "../../stages/validate/validators.js";
import { normalizeStudentStandardLoginPayload } from "../../stages/normalize/normalizers.js";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js";
import { processStudentStandardLogin } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
