import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.91-student-auth-persistence";
import { validateCompletedStepIds, validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.91-student-auth-persistence";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.91-student-auth-persistence";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.91-student-auth-persistence";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.91-student-auth-persistence";
import { processSaveStudentProgress } from "../../stages/process/processors.js?v=1.1.91-student-auth-persistence";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.91-student-auth-persistence";

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
