import { validateStudentFruitLoginPayload } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { normalizeStudentFruitLoginPayload } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { processStudentFruitLogin } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

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
