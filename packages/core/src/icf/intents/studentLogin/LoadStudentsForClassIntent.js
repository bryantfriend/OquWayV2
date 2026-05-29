import { validateStudentsForClassPayload } from "../../stages/validate/validators.js";
import { normalizeStudentsForClassPayload } from "../../stages/normalize/normalizers.js";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js";
import { processLoadStudentsForClass } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function LoadStudentsForClassIntent() {
  return {
    type: "LoadStudentsForClassIntent",
    validate: [
      validateStudentsForClassPayload
    ],
    normalize: [
      normalizeStudentsForClassPayload
    ],
    addContext: [],
    authorize: [
      allowStudentLoginAuthorization
    ],
    process: [
      processLoadStudentsForClass
    ],
    emit: [
      emitIntentResult
    ]
  };
}
