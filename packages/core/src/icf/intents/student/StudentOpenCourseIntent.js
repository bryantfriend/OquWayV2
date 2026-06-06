import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.93-student-class-alias";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.93-student-class-alias";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext, attachStudentOpenCourseContext } from "../../stages/addContext/contexts.js?v=1.1.93-student-class-alias";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.93-student-class-alias";
import { processStudentOpenCourse } from "../../stages/process/processors.js?v=1.1.93-student-class-alias";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.93-student-class-alias";

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
