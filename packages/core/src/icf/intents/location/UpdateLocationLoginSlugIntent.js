import { validateAuthenticated, validateLocationId, validateLocationLoginSlugPayload } from "../../stages/validate/validators.js?v=1.1.121-student-dashboard-open-clean";
import { normalizeLocationLoginSlugPayload } from "../../stages/normalize/normalizers.js?v=1.1.121-student-dashboard-open-clean";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.121-student-dashboard-open-clean";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.121-student-dashboard-open-clean";
import { processUpdateLocationLoginSlug } from "../../stages/process/processors.js?v=1.1.121-student-dashboard-open-clean";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.121-student-dashboard-open-clean";

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
