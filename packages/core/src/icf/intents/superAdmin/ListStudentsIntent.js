import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.124-location-icon-upload";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.124-location-icon-upload";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.124-location-icon-upload";
import { processListStudents } from "../../stages/process/processors.js?v=1.1.124-location-icon-upload";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.124-location-icon-upload";

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
