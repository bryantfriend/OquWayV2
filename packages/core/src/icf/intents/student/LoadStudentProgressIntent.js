import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.151-student-loading-practice-context";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.151-student-loading-practice-context";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.151-student-loading-practice-context";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.151-student-loading-practice-context";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.151-student-loading-practice-context";
import { processStartPracticeMode } from "../../stages/process/processors.js?v=1.1.151-student-loading-practice-context";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.151-student-loading-practice-context";

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

