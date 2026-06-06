import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.89-student-fruit-session";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.89-student-fruit-session";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.89-student-fruit-session";
import { processStartStudentSession } from "../../stages/process/processors.js?v=1.1.89-student-fruit-session";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.89-student-fruit-session";

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
