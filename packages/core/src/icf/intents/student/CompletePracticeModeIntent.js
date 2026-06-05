import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.78-location-command-center";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.78-location-command-center";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.78-location-command-center";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.78-location-command-center";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.78-location-command-center";
import { processCompletePracticeMode } from "../../stages/process/processors.js?v=1.1.78-location-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.78-location-command-center";

export function CompletePracticeModeIntent() {
  return {
    type: "CompletePracticeModeIntent",
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
      processCompletePracticeMode
    ],
    emit: [
      emitIntentResult
    ]
  };
}
