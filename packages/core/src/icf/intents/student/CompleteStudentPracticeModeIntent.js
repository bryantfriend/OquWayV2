import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.63-external-task-student-feedback";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.63-external-task-student-feedback";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.63-external-task-student-feedback";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { processCompletePracticeMode } from "../../stages/process/processors.js?v=1.1.63-external-task-student-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.63-external-task-student-feedback";

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
