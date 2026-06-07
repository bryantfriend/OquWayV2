import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.114-student-profile-rules";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { processCompletePracticeMode } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

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
