import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.103-student-profile-actor-fallback";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.103-student-profile-actor-fallback";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.103-student-profile-actor-fallback";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.103-student-profile-actor-fallback";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.103-student-profile-actor-fallback";
import { processStartPracticeMode } from "../../stages/process/processors.js?v=1.1.103-student-profile-actor-fallback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.103-student-profile-actor-fallback";

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
