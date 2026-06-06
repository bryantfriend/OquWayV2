import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.93-student-class-alias";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.93-student-class-alias";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.93-student-class-alias";
import { processStartStudentSession } from "../../stages/process/processors.js?v=1.1.93-student-class-alias";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.93-student-class-alias";

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
