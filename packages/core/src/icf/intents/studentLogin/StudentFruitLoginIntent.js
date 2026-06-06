import { validateStudentFruitLoginPayload } from "../../stages/validate/validators.js?v=1.1.97-student-session-uid";
import { normalizeStudentFruitLoginPayload } from "../../stages/normalize/normalizers.js?v=1.1.97-student-session-uid";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.97-student-session-uid";
import { processStudentFruitLogin } from "../../stages/process/processors.js?v=1.1.97-student-session-uid";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.97-student-session-uid";

export function StudentFruitLoginIntent() {
  return {
    type: "StudentFruitLoginIntent",
    validate: [
      validateStudentFruitLoginPayload
    ],
    normalize: [
      normalizeStudentFruitLoginPayload
    ],
    addContext: [],
    authorize: [
      allowStudentLoginAuthorization
    ],
    process: [
      processStudentFruitLogin
    ],
    emit: [
      emitIntentResult
    ]
  };
}
