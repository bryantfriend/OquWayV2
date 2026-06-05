import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.62-external-task-review-loop";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { processStartPracticeMode } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

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
