import { validateAuthenticated, validateLocationId, validateLocationLoginModePayload } from "../../stages/validate/validators.js?v=1.1.80-course-module-command-center";
import { normalizeLocationLoginModePayload } from "../../stages/normalize/normalizers.js?v=1.1.80-course-module-command-center";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.80-course-module-command-center";
import { requireLocationAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.80-course-module-command-center";
import { processUpdateLocationLoginMode } from "../../stages/process/processors.js?v=1.1.80-course-module-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.80-course-module-command-center";

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
