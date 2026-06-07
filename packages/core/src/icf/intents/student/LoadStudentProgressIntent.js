import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.118-fruit-login-student-identity";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.118-fruit-login-student-identity";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.118-fruit-login-student-identity";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.118-fruit-login-student-identity";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.118-fruit-login-student-identity";
import { processStartPracticeMode } from "../../stages/process/processors.js?v=1.1.118-fruit-login-student-identity";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.118-fruit-login-student-identity";

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
