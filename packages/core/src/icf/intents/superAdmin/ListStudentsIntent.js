import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.29-module-render-fix";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.29-module-render-fix";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.29-module-render-fix";
import { processListStudents } from "../../stages/process/processors.js?v=1.1.29-module-render-fix";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.29-module-render-fix";

export function ListStudentsIntent() {
  return {
    type: "ListStudentsIntent",
    validate: [validateAuthenticated],
    normalize: [],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireCourseAssignmentAdminAuthorization],
    process: [processListStudents],
    emit: [emitIntentResult]
  };
}
