import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.111-student-assignment-debug-panel";
import { validateCompletedStepIds, validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.111-student-assignment-debug-panel";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.111-student-assignment-debug-panel";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.111-student-assignment-debug-panel";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.111-student-assignment-debug-panel";
import { processSaveStudentProgress } from "../../stages/process/processors.js?v=1.1.111-student-assignment-debug-panel";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.111-student-assignment-debug-panel";

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
