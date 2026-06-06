import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.98-student-session-proof";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.98-student-session-proof";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.98-student-session-proof";
import { processLoadStudentCourse } from "../../stages/process/processors.js?v=1.1.98-student-session-proof";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.98-student-session-proof";

export function LoadStudentCourseIntent() {
  return {
    type: "LoadStudentCourseIntent",
    validate: [
      validateAuthenticated
    ],
    normalize: [],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachStudentProfileContext
    ],
    authorize: [
      requireStudentAuthorization
    ],
    process: [
      processLoadStudentCourse
    ],
    emit: [
      emitIntentResult
    ]
  };
}
