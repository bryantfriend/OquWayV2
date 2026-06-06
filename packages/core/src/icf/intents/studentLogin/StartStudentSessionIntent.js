import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.94-student-profile-context";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.94-student-profile-context";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.94-student-profile-context";
import { processStartStudentSession } from "../../stages/process/processors.js?v=1.1.94-student-profile-context";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.94-student-profile-context";

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
