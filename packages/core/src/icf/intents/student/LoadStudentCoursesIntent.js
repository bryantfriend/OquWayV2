import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.88-student-course-assignment-trace";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.88-student-course-assignment-trace";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.88-student-course-assignment-trace";
import { processLoadStudentCourse } from "../../stages/process/processors.js?v=1.1.88-student-course-assignment-trace";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.88-student-course-assignment-trace";

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
