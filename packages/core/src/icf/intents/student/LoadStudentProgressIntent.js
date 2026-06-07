import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.124-location-icon-upload";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.124-location-icon-upload";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.124-location-icon-upload";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.124-location-icon-upload";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.124-location-icon-upload";
import { processStartPracticeMode } from "../../stages/process/processors.js?v=1.1.124-location-icon-upload";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.124-location-icon-upload";

export function LoadStudentProgressIntent() {
  return {
    type: "LoadStudentProgressIntent",
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
      attachStudentSessionContext
    ],
    authorize: [
      requireStudentAuthorization
    ],
    process: [
      processStartPracticeMode
    ],
    emit: [
      emitIntentResult
    ]
  };
}
