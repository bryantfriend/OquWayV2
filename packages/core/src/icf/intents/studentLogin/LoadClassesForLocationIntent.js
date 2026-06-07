import { validateClassLocationPayload } from "../../stages/validate/validators.js?v=1.1.117-student-identity-binding";
import { normalizeClassLocationPayload } from "../../stages/normalize/normalizers.js?v=1.1.117-student-identity-binding";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.117-student-identity-binding";
import { processLoadClassesForLocation } from "../../stages/process/processors.js?v=1.1.117-student-identity-binding";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.117-student-identity-binding";

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
