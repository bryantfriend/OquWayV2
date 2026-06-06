import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.92-student-login-race";
import { validateCompletedStepIds, validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.92-student-login-race";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.92-student-login-race";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.92-student-login-race";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.92-student-login-race";
import { processSaveStudentProgress } from "../../stages/process/processors.js?v=1.1.92-student-login-race";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.92-student-login-race";

export function SaveStudentProgressIntent() {
  return {
    type: "SaveStudentProgressIntent",
    validate: [
      validateAuthenticated,
      validateStudentProgressPayload,
      validatePracticeModeKey,
      validateCompletedStepIds
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
      processSaveStudentProgress
    ],
    emit: [
      emitIntentResult
    ]
  };
}
