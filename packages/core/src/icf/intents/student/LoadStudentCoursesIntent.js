import { validateAuthenticated } from "../../stages/validate/validators.js";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js";
import { processLoadStudentCourse } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
