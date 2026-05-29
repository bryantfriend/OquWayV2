import { validateAuthenticated, validateLocationId, validateLocationLoginModePayload } from "../../stages/validate/validators.js";
import { normalizeLocationLoginModePayload } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { requireLocationAdminAuthorization } from "../../stages/authorize/authorizers.js";
import { processUpdateLocationLoginMode } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
