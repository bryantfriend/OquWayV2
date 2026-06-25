import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.213-emotional-checkin-owner";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.213-emotional-checkin-owner";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.213-emotional-checkin-owner";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.213-emotional-checkin-owner";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.213-emotional-checkin-owner";
import { processCompletePracticeMode } from "../../stages/process/processors.js?v=1.1.213-emotional-checkin-owner";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.213-emotional-checkin-owner";

export function CompleteStudentPracticeModeIntent() {
  return {
    type: "CompleteStudentPracticeModeIntent",
    validate: [
      validateAuthenticated,
      validateStudentProgressPayload,
      validatePracticeModeKey
    ],
    normalize: [
      normalizeStudentProgressPayload
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachStudentProfileContext,
      attachStudentSessionContext
    ],
    authorize: [
      requireStudentAuthorization
    ],
    process: [
      processCompletePracticeMode
    ],
    emit: [
      emitIntentResult
    ]
  };
}
