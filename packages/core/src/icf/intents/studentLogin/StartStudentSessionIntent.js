import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.97-student-session-uid";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.97-student-session-uid";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.97-student-session-uid";
import { processStartStudentSession } from "../../stages/process/processors.js?v=1.1.97-student-session-uid";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.97-student-session-uid";

export function StartStudentSessionIntent() {
  return {
    type: "StartStudentSessionIntent",
    validate: [
      validateAuthenticated
    ],
    normalize: [],
    addContext: [
      attachActorContext,
      attachActorRoleContext
    ],
    authorize: [
      requireStudentAuthorization
    ],
    process: [
      processStartStudentSession
    ],
    emit: [
      emitIntentResult
    ]
  };
}
