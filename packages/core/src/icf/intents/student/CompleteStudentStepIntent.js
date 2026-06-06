import { validateAuthenticated, validatePracticeModeKey, validatePracticeModeStepId } from "../../stages/validate/validators.js?v=1.1.98-student-session-proof";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.98-student-session-proof";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.98-student-session-proof";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.98-student-session-proof";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.98-student-session-proof";
import { processCompleteStep } from "../../stages/process/processors.js?v=1.1.98-student-session-proof";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.98-student-session-proof";

export function CompleteStudentStepIntent() {
  return {
    type: "CompleteStudentStepIntent",
    validate: [
      validateAuthenticated,
      validateStudentProgressPayload,
      validatePracticeModeKey,
      validatePracticeModeStepId
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
      processCompleteStep
    ],
    emit: [
      emitIntentResult
    ]
  };
}
