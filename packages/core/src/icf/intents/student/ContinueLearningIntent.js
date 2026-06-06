import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.93-student-class-alias";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.93-student-class-alias";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.93-student-class-alias";
import { processContinueLearning } from "../../stages/process/processors.js?v=1.1.93-student-class-alias";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.93-student-class-alias";

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
