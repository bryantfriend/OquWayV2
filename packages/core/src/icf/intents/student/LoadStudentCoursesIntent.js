import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.89-student-fruit-session";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.89-student-fruit-session";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.89-student-fruit-session";
import { processLoadStudentCourse } from "../../stages/process/processors.js?v=1.1.89-student-fruit-session";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.89-student-fruit-session";

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
