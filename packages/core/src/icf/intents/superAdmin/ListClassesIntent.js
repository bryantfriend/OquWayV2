import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.80-course-module-command-center";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.80-course-module-command-center";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.80-course-module-command-center";
import { processListClasses } from "../../stages/process/processors.js?v=1.1.80-course-module-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.80-course-module-command-center";

export function ListClassesIntent() {
  return {
    type: "ListClassesIntent",
    validate: [validateAuthenticated],
    normalize: [],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireCourseAssignmentAdminAuthorization],
    process: [processListClasses],
    emit: [emitIntentResult]
  };
}
