import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { processStartPracticeMode } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

export function StartPracticeModeIntent() {
  return {
    type: "StartPracticeModeIntent",
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
