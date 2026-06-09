import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.124-location-icon-upload";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.124-location-icon-upload";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext, attachStudentOpenCourseContext } from "../../stages/addContext/contexts.js?v=1.1.124-location-icon-upload";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.124-location-icon-upload";
import { processStudentOpenCourse } from "../../stages/process/processors.js?v=1.1.147-student-course-shell";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.124-location-icon-upload";

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
