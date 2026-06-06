import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.104-student-assignment-json-trace";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.104-student-assignment-json-trace";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.104-student-assignment-json-trace";
import { processLoadStudentDashboard } from "../../stages/process/processors.js?v=1.1.104-student-assignment-json-trace";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.104-student-assignment-json-trace";

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
