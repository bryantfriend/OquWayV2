import { validateStudentStandardLoginPayload } from "../../stages/validate/validators.js?v=1.1.111-student-assignment-debug-panel";
import { normalizeStudentStandardLoginPayload } from "../../stages/normalize/normalizers.js?v=1.1.111-student-assignment-debug-panel";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.111-student-assignment-debug-panel";
import { processStudentStandardLogin } from "../../stages/process/processors.js?v=1.1.111-student-assignment-debug-panel";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.111-student-assignment-debug-panel";

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
