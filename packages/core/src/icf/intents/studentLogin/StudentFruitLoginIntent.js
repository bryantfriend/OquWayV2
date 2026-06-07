import { validateStudentFruitLoginPayload } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { normalizeStudentFruitLoginPayload } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processStudentFruitLogin } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

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
