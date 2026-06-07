import { validateStudentFruitLoginPayload } from "../../stages/validate/validators.js?v=1.1.118-fruit-login-student-identity";
import { normalizeStudentFruitLoginPayload } from "../../stages/normalize/normalizers.js?v=1.1.118-fruit-login-student-identity";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.118-fruit-login-student-identity";
import { processStudentFruitLogin } from "../../stages/process/processors.js?v=1.1.118-fruit-login-student-identity";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.118-fruit-login-student-identity";

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
