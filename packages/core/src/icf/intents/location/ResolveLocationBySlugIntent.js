import { validateResolveLocationSlugPayload } from "../../stages/validate/validators.js";
import { normalizeResolveLocationSlugPayload } from "../../stages/normalize/normalizers.js";
import { allowPublicLocationRead } from "../../stages/authorize/authorizers.js";
import { processResolveLocationBySlug } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
