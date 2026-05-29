import { validateAuthenticated, validateLocationId, validateLocationLoginSlugPayload } from "../../stages/validate/validators.js";
import { normalizeLocationLoginSlugPayload } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js";
import { processUpdateLocationLoginSlug } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function UpdateLocationLoginSlugIntent() {
  return {
    type: "UpdateLocationLoginSlugIntent",
    validate: [
      validateAuthenticated,
      validateLocationId,
      validateLocationLoginSlugPayload
    ],
    normalize: [
      normalizeLocationLoginSlugPayload
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext
    ],
    authorize: [
      requireSuperAdminAccess
    ],
    process: [
      processUpdateLocationLoginSlug
    ],
    emit: [
      emitIntentResult
    ]
  };
}
