import { validateStudentsForClassPayload } from "../../stages/validate/validators.js?v=1.1.94-student-profile-context";
import { normalizeStudentsForClassPayload } from "../../stages/normalize/normalizers.js?v=1.1.94-student-profile-context";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.94-student-profile-context";
import { processLoadStudentsForClass } from "../../stages/process/processors.js?v=1.1.94-student-profile-context";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.94-student-profile-context";

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
