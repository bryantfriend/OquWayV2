import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processStartPracticeMode } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

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
