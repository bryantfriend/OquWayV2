import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js";
import { processStartPracticeMode } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
