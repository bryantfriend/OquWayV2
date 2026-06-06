import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.97-student-session-uid";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.97-student-session-uid";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.97-student-session-uid";
import { processLoadStudentProfile } from "../../stages/process/processors.js?v=1.1.97-student-session-uid";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.97-student-session-uid";

export function LoadStudentProfileIntent() {
  return {
    type: "LoadStudentProfileIntent",
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
      processLoadStudentProfile
    ],
    emit: [
      emitIntentResult
    ]
  };
}
