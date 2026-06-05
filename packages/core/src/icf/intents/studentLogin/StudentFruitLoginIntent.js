import { validateStudentFruitLoginPayload } from "../../stages/validate/validators.js?v=1.1.78-location-command-center";
import { normalizeStudentFruitLoginPayload } from "../../stages/normalize/normalizers.js?v=1.1.78-location-command-center";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.78-location-command-center";
import { processStudentFruitLogin } from "../../stages/process/processors.js?v=1.1.78-location-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.78-location-command-center";

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
