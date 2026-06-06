import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.100-student-profile-actor";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.100-student-profile-actor";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext, attachStudentOpenCourseContext } from "../../stages/addContext/contexts.js?v=1.1.100-student-profile-actor";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.100-student-profile-actor";
import { processStudentOpenCourse } from "../../stages/process/processors.js?v=1.1.100-student-profile-actor";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.100-student-profile-actor";

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
