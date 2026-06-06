import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.92-student-login-race";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.92-student-login-race";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.92-student-login-race";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.92-student-login-race";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.92-student-login-race";
import { processStartPracticeMode } from "../../stages/process/processors.js?v=1.1.92-student-login-race";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.92-student-login-race";

export function LoadStudentCourseStructureIntent() {
  return {
    type: "LoadStudentCourseStructureIntent",
    validate: [
      validateAuthenticated,
      validateStudentProgressPayload
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
