import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.117-student-identity-binding";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.117-student-identity-binding";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.117-student-identity-binding";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.117-student-identity-binding";
import { processStartPracticeMode } from "../../stages/process/processors.js?v=1.1.117-student-identity-binding";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.117-student-identity-binding";

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
