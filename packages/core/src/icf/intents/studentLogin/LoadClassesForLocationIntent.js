import { validateClassLocationPayload } from "../../stages/validate/validators.js";
import { normalizeClassLocationPayload } from "../../stages/normalize/normalizers.js";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js";
import { processLoadClassesForLocation } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
