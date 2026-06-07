import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.116-student-token-ready";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.116-student-token-ready";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.116-student-token-ready";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.116-student-token-ready";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.116-student-token-ready";
import { processStartPracticeMode } from "../../stages/process/processors.js?v=1.1.116-student-token-ready";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.116-student-token-ready";

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
