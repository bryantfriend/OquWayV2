import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.82-shared-command-center-shell";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.82-shared-command-center-shell";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.82-shared-command-center-shell";
import { processLoadStudentDashboard } from "../../stages/process/processors.js?v=1.1.85-visual-helpers-syntax";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.82-shared-command-center-shell";

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
