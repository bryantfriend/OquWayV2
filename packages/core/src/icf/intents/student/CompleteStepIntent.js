import { validateAuthenticated, validatePracticeModeKey, validatePracticeModeStepId } from "../../stages/validate/validators.js?v=1.1.93-student-class-alias";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.93-student-class-alias";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.93-student-class-alias";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.93-student-class-alias";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.93-student-class-alias";
import { processCompleteStep } from "../../stages/process/processors.js?v=1.1.93-student-class-alias";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.93-student-class-alias";

export function CompleteStepIntent() {
  return {
    type: "CompleteStepIntent",
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
