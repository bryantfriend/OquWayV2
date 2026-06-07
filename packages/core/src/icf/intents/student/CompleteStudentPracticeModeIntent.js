import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.120-student-course-debug-summary";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.120-student-course-debug-summary";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.120-student-course-debug-summary";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.120-student-course-debug-summary";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.120-student-course-debug-summary";
import { processCompletePracticeMode } from "../../stages/process/processors.js?v=1.1.120-student-course-debug-summary";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.120-student-course-debug-summary";

export function CompleteStudentPracticeModeIntent() {
  return {
    type: "CompleteStudentPracticeModeIntent",
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
      processCompletePracticeMode
    ],
    emit: [
      emitIntentResult
    ]
  };
}
