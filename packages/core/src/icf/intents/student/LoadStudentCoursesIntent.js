import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.210-student-course-hydration";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.210-student-course-hydration";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.210-student-course-hydration";
import { processLoadStudentCourse } from "../../stages/process/processors.js?v=1.1.210-student-course-hydration";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.210-student-course-hydration";

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
