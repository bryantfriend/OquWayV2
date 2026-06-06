import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.99-student-profile-gate";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.99-student-profile-gate";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.99-student-profile-gate";
import { processLoadStudentDashboard } from "../../stages/process/processors.js?v=1.1.99-student-profile-gate";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.99-student-profile-gate";

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
