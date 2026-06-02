import { validateClassLocationPayload } from "../../stages/validate/validators.js?v=1.1.29-module-render-fix";
import { normalizeClassLocationPayload } from "../../stages/normalize/normalizers.js?v=1.1.29-module-render-fix";
import { allowStudentLoginAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.29-module-render-fix";
import { processLoadClassesForLocation } from "../../stages/process/processors.js?v=1.1.29-module-render-fix";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.29-module-render-fix";

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
