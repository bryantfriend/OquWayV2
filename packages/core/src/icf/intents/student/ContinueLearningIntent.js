import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.105-student-active-assignment-query";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.105-student-active-assignment-query";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.105-student-active-assignment-query";
import { processContinueLearning } from "../../stages/process/processors.js?v=1.1.105-student-active-assignment-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.105-student-active-assignment-query";

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
