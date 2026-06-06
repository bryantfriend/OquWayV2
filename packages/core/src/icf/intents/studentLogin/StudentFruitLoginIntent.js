import { validateStudentFruitLoginPayload } from "../../stages/validate/validators.js?v=1.1.93-student-class-alias";
import { normalizeStudentFruitLoginPayload } from "../../stages/normalize/normalizers.js?v=1.1.93-student-class-alias";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.93-student-class-alias";
import { processStudentFruitLogin } from "../../stages/process/processors.js?v=1.1.93-student-class-alias";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.93-student-class-alias";

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
