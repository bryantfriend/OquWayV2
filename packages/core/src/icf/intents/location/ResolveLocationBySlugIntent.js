import { validateResolveLocationSlugPayload } from "../../stages/validate/validators.js?v=1.1.82-shared-command-center-shell";
import { normalizeResolveLocationSlugPayload } from "../../stages/normalize/normalizers.js?v=1.1.82-shared-command-center-shell";
import { allowPublicLocationRead } from "../../stages/authorize/authorizers.js?v=1.1.82-shared-command-center-shell";
import { processResolveLocationBySlug } from "../../stages/process/processors.js?v=1.1.82-shared-command-center-shell";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.82-shared-command-center-shell";

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
