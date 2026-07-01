import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.82-shared-command-center-shell";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.82-shared-command-center-shell";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext, attachStudentOpenCourseContext } from "../../stages/addContext/contexts.js?v=1.1.82-shared-command-center-shell";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.82-shared-command-center-shell";
import { processStudentOpenCourse } from "../../stages/process/processors.js?v=1.1.85-visual-helpers-syntax";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.82-shared-command-center-shell";

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
