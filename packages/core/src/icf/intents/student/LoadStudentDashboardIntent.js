import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.124-location-icon-upload";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.124-location-icon-upload";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.124-location-icon-upload";
import { processLoadStudentDashboard } from "../../stages/process/processors.js?v=1.1.149-student-course-metadata";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.124-location-icon-upload";

export function LoadStudentDashboardIntent() {
  return {
    type: "LoadStudentDashboardIntent",
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
      processLoadStudentDashboard
    ],
    emit: [
      emitIntentResult
    ]
  };
}
