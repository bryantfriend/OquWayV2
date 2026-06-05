import { validateAuthenticated, validateLocationId, validateLocationLoginModePayload } from "../../stages/validate/validators.js?v=1.1.70-external-task-feedback";
import { normalizeLocationLoginModePayload } from "../../stages/normalize/normalizers.js?v=1.1.70-external-task-feedback";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.70-external-task-feedback";
import { requireLocationAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.70-external-task-feedback";
import { processUpdateLocationLoginMode } from "../../stages/process/processors.js?v=1.1.70-external-task-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.70-external-task-feedback";

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
