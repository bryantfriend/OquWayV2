import { validateStudentsForClassPayload } from "../../stages/validate/validators.js?v=1.1.162-modal-stack";
import { normalizeStudentsForClassPayload } from "../../stages/normalize/normalizers.js?v=1.1.162-modal-stack";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.162-modal-stack";
import { processLoadStudentsForClass } from "../../stages/process/processors.js?v=1.1.162-modal-stack";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.162-modal-stack";

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
