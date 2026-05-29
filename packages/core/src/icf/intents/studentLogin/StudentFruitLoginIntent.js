import { validateStudentFruitLoginPayload } from "../../stages/validate/validators.js";
import { normalizeStudentFruitLoginPayload } from "../../stages/normalize/normalizers.js";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js";
import { processStudentFruitLogin } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
