import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.112-student-assignment-error-debug";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.112-student-assignment-error-debug";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.112-student-assignment-error-debug";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.112-student-assignment-error-debug";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.112-student-assignment-error-debug";
import { processCompletePracticeMode } from "../../stages/process/processors.js?v=1.1.112-student-assignment-error-debug";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.112-student-assignment-error-debug";

export function CompletePracticeModeIntent() {
  return {
    type: "CompletePracticeModeIntent",
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
