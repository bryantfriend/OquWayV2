import { validateStudentFruitLoginPayload } from "../../stages/validate/validators.js?v=1.1.89-student-fruit-session";
import { normalizeStudentFruitLoginPayload } from "../../stages/normalize/normalizers.js?v=1.1.89-student-fruit-session";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.89-student-fruit-session";
import { processStudentFruitLogin } from "../../stages/process/processors.js?v=1.1.89-student-fruit-session";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.89-student-fruit-session";

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
