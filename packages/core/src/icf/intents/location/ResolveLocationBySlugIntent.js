import { validateResolveLocationSlugPayload } from "../../stages/validate/validators.js?v=1.1.79-user-command-center";
import { normalizeResolveLocationSlugPayload } from "../../stages/normalize/normalizers.js?v=1.1.79-user-command-center";
import { allowPublicLocationRead } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { processResolveLocationBySlug } from "../../stages/process/processors.js?v=1.1.79-user-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.79-user-command-center";

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
