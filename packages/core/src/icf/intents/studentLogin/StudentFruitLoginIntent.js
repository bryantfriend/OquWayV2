import { validateStudentFruitLoginPayload } from "../../stages/validate/validators.js?v=1.1.92-student-login-race";
import { normalizeStudentFruitLoginPayload } from "../../stages/normalize/normalizers.js?v=1.1.92-student-login-race";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.92-student-login-race";
import { processStudentFruitLogin } from "../../stages/process/processors.js?v=1.1.92-student-login-race";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.92-student-login-race";

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
