import { validateAuthenticated, validatePracticeModeKey, validatePracticeModeStepId } from "../../stages/validate/validators.js?v=1.1.210-student-course-hydration";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.210-student-course-hydration";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.210-student-course-hydration";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.210-student-course-hydration";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.210-student-course-hydration";
import { processCompleteStep } from "../../stages/process/processors.js?v=1.1.210-student-course-hydration";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.210-student-course-hydration";

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
      attachStudentProfileContext,
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
