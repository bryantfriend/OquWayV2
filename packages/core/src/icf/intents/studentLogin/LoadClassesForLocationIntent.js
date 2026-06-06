import { validateClassLocationPayload } from "../../stages/validate/validators.js?v=1.1.97-student-session-uid";
import { normalizeClassLocationPayload } from "../../stages/normalize/normalizers.js?v=1.1.97-student-session-uid";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.97-student-session-uid";
import { processLoadClassesForLocation } from "../../stages/process/processors.js?v=1.1.97-student-session-uid";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.97-student-session-uid";

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
