import { validateClassLocationPayload } from "../../stages/validate/validators.js?v=1.1.118-fruit-login-student-identity";
import { normalizeClassLocationPayload } from "../../stages/normalize/normalizers.js?v=1.1.118-fruit-login-student-identity";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.118-fruit-login-student-identity";
import { processLoadClassesForLocation } from "../../stages/process/processors.js?v=1.1.118-fruit-login-student-identity";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.118-fruit-login-student-identity";

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
