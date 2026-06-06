import { validateClassLocationPayload } from "../../stages/validate/validators.js?v=1.1.89-student-fruit-session";
import { normalizeClassLocationPayload } from "../../stages/normalize/normalizers.js?v=1.1.89-student-fruit-session";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.89-student-fruit-session";
import { processLoadClassesForLocation } from "../../stages/process/processors.js?v=1.1.89-student-fruit-session";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.89-student-fruit-session";

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
