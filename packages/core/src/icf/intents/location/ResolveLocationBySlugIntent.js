import { validateResolveLocationSlugPayload } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { normalizeResolveLocationSlugPayload } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { allowPublicLocationRead } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processResolveLocationBySlug } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

export function ResolveLocationBySlugIntent() {
  return {
    type: "ResolveLocationBySlugIntent",
    validate: [
      validateResolveLocationSlugPayload
    ],
    normalize: [
      normalizeResolveLocationSlugPayload
    ],
    addContext: [],
    authorize: [
      allowPublicLocationRead
    ],
    process: [
      processResolveLocationBySlug
    ],
    emit: [
      emitIntentResult
    ]
  };
}
