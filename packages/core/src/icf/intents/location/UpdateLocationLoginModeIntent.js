import { validateAuthenticated, validateLocationId, validateLocationLoginModePayload } from "../../stages/validate/validators.js?v=1.1.121-student-dashboard-open-clean";
import { normalizeLocationLoginModePayload } from "../../stages/normalize/normalizers.js?v=1.1.121-student-dashboard-open-clean";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.121-student-dashboard-open-clean";
import { requireLocationAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.121-student-dashboard-open-clean";
import { processUpdateLocationLoginMode } from "../../stages/process/processors.js?v=1.1.121-student-dashboard-open-clean";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.121-student-dashboard-open-clean";

export function UpdateLocationLoginModeIntent() {
  return {
    type: "UpdateLocationLoginModeIntent",
    validate: [
      validateAuthenticated,
      validateLocationId,
      validateLocationLoginModePayload
    ],
    normalize: [
      normalizeLocationLoginModePayload
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext
    ],
    authorize: [
      requireLocationAdminAuthorization
    ],
    process: [
      processUpdateLocationLoginMode
    ],
    emit: [
      emitIntentResult
    ]
  };
}
