import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.113-student-rules-read";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { processLoadStudentCourse } from "../../stages/process/processors.js?v=1.1.113-student-rules-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.113-student-rules-read";

export function LoadStudentCoursesIntent() {
  return {
    type: "LoadStudentCoursesIntent",
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
