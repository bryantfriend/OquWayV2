import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.73-student-course-polish";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.73-student-course-polish";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext, attachStudentOpenCourseContext } from "../../stages/addContext/contexts.js?v=1.1.73-student-course-polish";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.73-student-course-polish";
import { processStudentOpenCourse } from "../../stages/process/processors.js?v=1.1.73-student-course-polish";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.73-student-course-polish";

export function StudentOpenCourseIntent() {
  return {
    type: "StudentOpenCourseIntent",
    validate: [
      validateAuthenticated,
      validateCourseId
    ],
    normalize: [
      normalizeCourseId
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachStudentProfileContext,
      attachStudentOpenCourseContext
    ],
    authorize: [
      requireStudentAuthorization
    ],
    process: [
      processStudentOpenCourse
    ],
    emit: [
      emitIntentResult
    ]
  };
}
