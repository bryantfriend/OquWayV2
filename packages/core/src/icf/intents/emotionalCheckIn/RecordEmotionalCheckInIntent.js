import { validateAuthenticated, validateEmotionalCheckInPayload } from "../../stages/validate/validators.js?v=1.1.161-universal-check-in";
import { normalizeEmotionalCheckInPayload } from "../../stages/normalize/normalizers.js?v=1.1.161-universal-check-in";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.161-universal-check-in";
import { requireEmotionalCheckInAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.161-universal-check-in";
import { processRecordEmotionalCheckIn } from "../../stages/process/processors.js?v=1.1.161-universal-check-in";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.124-location-icon-upload";

export function RecordEmotionalCheckInIntent() {
  return {
    type: "RecordEmotionalCheckInIntent",
    validate: [
      validateAuthenticated,
      validateEmotionalCheckInPayload
    ],
    normalize: [
      normalizeEmotionalCheckInPayload
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext
    ],
    authorize: [
      requireEmotionalCheckInAuthorization
    ],
    process: [
      processRecordEmotionalCheckIn
    ],
    emit: [
      emitIntentResult
    ]
  };
}
