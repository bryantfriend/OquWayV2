import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.95-student-icf-root";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.95-student-icf-root";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.95-student-icf-root";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.95-student-icf-root";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.95-student-icf-root";
import { processStartPracticeMode } from "../../stages/process/processors.js?v=1.1.95-student-icf-root";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.95-student-icf-root";

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
