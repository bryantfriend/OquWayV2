import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.106-student-assignment-error-trace";
import { validateCompletedStepIds, validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.106-student-assignment-error-trace";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.106-student-assignment-error-trace";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.106-student-assignment-error-trace";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.106-student-assignment-error-trace";
import { processSaveStudentProgress } from "../../stages/process/processors.js?v=1.1.106-student-assignment-error-trace";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.106-student-assignment-error-trace";

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
