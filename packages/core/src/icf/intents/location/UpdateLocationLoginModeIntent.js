import { validateAuthenticated, validateLocationId, validateLocationLoginModePayload } from "../../stages/validate/validators.js?v=1.1.118-fruit-login-student-identity";
import { normalizeLocationLoginModePayload } from "../../stages/normalize/normalizers.js?v=1.1.118-fruit-login-student-identity";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.118-fruit-login-student-identity";
import { requireLocationAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.118-fruit-login-student-identity";
import { processUpdateLocationLoginMode } from "../../stages/process/processors.js?v=1.1.118-fruit-login-student-identity";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.118-fruit-login-student-identity";

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
