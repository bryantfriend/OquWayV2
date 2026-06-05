import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.73-student-course-polish";
import { validateCompletedStepIds, validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.73-student-course-polish";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.73-student-course-polish";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.73-student-course-polish";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.73-student-course-polish";
import { processSaveStudentProgress } from "../../stages/process/processors.js?v=1.1.73-student-course-polish";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.73-student-course-polish";

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
