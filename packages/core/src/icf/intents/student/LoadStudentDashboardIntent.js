import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { processLoadStudentDashboard } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

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
