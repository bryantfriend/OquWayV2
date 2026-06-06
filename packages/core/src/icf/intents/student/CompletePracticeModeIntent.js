import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.101-student-profile-fallback";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.101-student-profile-fallback";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.101-student-profile-fallback";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.101-student-profile-fallback";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.101-student-profile-fallback";
import { processCompletePracticeMode } from "../../stages/process/processors.js?v=1.1.101-student-profile-fallback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.101-student-profile-fallback";

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
