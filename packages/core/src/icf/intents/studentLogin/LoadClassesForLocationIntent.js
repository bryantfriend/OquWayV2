import { validateClassLocationPayload } from "../../stages/validate/validators.js?v=1.1.88-student-course-assignment-trace";
import { normalizeClassLocationPayload } from "../../stages/normalize/normalizers.js?v=1.1.88-student-course-assignment-trace";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.88-student-course-assignment-trace";
import { processLoadClassesForLocation } from "../../stages/process/processors.js?v=1.1.88-student-course-assignment-trace";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.88-student-course-assignment-trace";

export function LoadClassesForLocationIntent() {
  return {
    type: "LoadClassesForLocationIntent",
    validate: [
      validateClassLocationPayload
    ],
    normalize: [
      normalizeClassLocationPayload
    ],
    addContext: [],
    authorize: [
      allowStudentLoginAuthorization
    ],
    process: [
      processLoadClassesForLocation
    ],
    emit: [
      emitIntentResult
    ]
  };
}
