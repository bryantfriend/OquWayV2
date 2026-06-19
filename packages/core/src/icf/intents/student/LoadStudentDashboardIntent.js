import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.162-modal-stack";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.162-modal-stack";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.162-modal-stack";
import { processLoadStudentDashboard } from "../../stages/process/processors.js?v=1.1.204-student-dashboard-load";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.162-modal-stack";

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
