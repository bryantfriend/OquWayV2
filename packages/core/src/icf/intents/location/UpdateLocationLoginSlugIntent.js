import { validateAuthenticated, validateLocationId, validateLocationLoginSlugPayload } from "../../stages/validate/validators.js?v=1.1.80-course-module-command-center";
import { normalizeLocationLoginSlugPayload } from "../../stages/normalize/normalizers.js?v=1.1.80-course-module-command-center";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.80-course-module-command-center";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.80-course-module-command-center";
import { processUpdateLocationLoginSlug } from "../../stages/process/processors.js?v=1.1.80-course-module-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.80-course-module-command-center";

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
