import { validateStudentsForClassPayload } from "../../stages/validate/validators.js?v=1.1.119-student-dashboard-debug-safe";
import { normalizeStudentsForClassPayload } from "../../stages/normalize/normalizers.js?v=1.1.119-student-dashboard-debug-safe";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.119-student-dashboard-debug-safe";
import { processLoadStudentsForClass } from "../../stages/process/processors.js?v=1.1.119-student-dashboard-debug-safe";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.119-student-dashboard-debug-safe";

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
