import { validateAuthenticated, validateEmotionalCheckInPayload } from "../../stages/validate/validators.js?v=1.1.207-emotional-check-in-save";
import { normalizeEmotionalCheckInPayload } from "../../stages/normalize/normalizers.js?v=1.1.207-emotional-check-in-save";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.207-emotional-check-in-save";
import { requireEmotionalCheckInAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.207-emotional-check-in-save";
import { processRecordEmotionalCheckIn } from "../../stages/process/processors.js?v=1.1.207-emotional-check-in-save";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.207-emotional-check-in-save";

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
