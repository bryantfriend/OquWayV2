import { validateAuthenticated } from "../../stages/validate/validators.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js";
import { processStartStudentSession } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
