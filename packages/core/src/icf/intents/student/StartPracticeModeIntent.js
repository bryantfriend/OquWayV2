import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.210-student-course-hydration";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.210-student-course-hydration";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.210-student-course-hydration";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.210-student-course-hydration";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.210-student-course-hydration";
import { processStartPracticeMode } from "../../stages/process/processors.js?v=1.1.210-student-course-hydration";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.210-student-course-hydration";

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
      attachStudentProfileContext,
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
