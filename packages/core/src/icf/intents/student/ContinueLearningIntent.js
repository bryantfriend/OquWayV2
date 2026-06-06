import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.96-student-session-profile";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.96-student-session-profile";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.96-student-session-profile";
import { processContinueLearning } from "../../stages/process/processors.js?v=1.1.96-student-session-profile";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.96-student-session-profile";

export function ContinueLearningIntent() {
  return {
    type: "ContinueLearningIntent",
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
      processContinueLearning
    ],
    emit: [
      emitIntentResult
    ]
  };
}
