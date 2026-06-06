import { validateClassLocationPayload } from "../../stages/validate/validators.js?v=1.1.95-student-icf-root";
import { normalizeClassLocationPayload } from "../../stages/normalize/normalizers.js?v=1.1.95-student-icf-root";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.95-student-icf-root";
import { processLoadClassesForLocation } from "../../stages/process/processors.js?v=1.1.95-student-icf-root";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.95-student-icf-root";

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
