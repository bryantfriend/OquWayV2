import { validateAuthenticated, validateEmotionalCheckInPayload } from "../../stages/validate/validators.js?v=1.1.162-modal-stack";
import { normalizeEmotionalCheckInPayload } from "../../stages/normalize/normalizers.js?v=1.1.162-modal-stack";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.162-modal-stack";
import { requireEmotionalCheckInAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.162-modal-stack";
import { processRecordEmotionalCheckIn } from "../../stages/process/processors.js?v=1.1.162-modal-stack";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.162-modal-stack";

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
