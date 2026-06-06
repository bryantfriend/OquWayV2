import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.94-student-profile-context";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.94-student-profile-context";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.94-student-profile-context";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.94-student-profile-context";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.94-student-profile-context";
import { processStartPracticeMode } from "../../stages/process/processors.js?v=1.1.94-student-profile-context";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.94-student-profile-context";

export function LoadStudentProgressIntent() {
  return {
    type: "LoadStudentProgressIntent",
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
      processStartPracticeMode
    ],
    emit: [
      emitIntentResult
    ]
  };
}
