import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.89-student-fruit-session";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.89-student-fruit-session";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext, attachStudentOpenCourseContext } from "../../stages/addContext/contexts.js?v=1.1.89-student-fruit-session";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.89-student-fruit-session";
import { processStudentOpenCourse } from "../../stages/process/processors.js?v=1.1.89-student-fruit-session";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.89-student-fruit-session";

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
