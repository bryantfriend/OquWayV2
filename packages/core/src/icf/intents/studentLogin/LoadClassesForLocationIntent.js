import { validateClassLocationPayload } from "../../stages/validate/validators.js?v=1.1.116-student-token-ready";
import { normalizeClassLocationPayload } from "../../stages/normalize/normalizers.js?v=1.1.116-student-token-ready";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.116-student-token-ready";
import { processLoadClassesForLocation } from "../../stages/process/processors.js?v=1.1.116-student-token-ready";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.116-student-token-ready";

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
