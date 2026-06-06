import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.97-student-session-uid";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.97-student-session-uid";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.97-student-session-uid";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.97-student-session-uid";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.97-student-session-uid";
import { processStartPracticeMode } from "../../stages/process/processors.js?v=1.1.97-student-session-uid";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.97-student-session-uid";

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
