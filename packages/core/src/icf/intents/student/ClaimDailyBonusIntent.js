import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { processClaimDailyBonus } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

export function ClaimDailyBonusIntent() {
  return {
    type: "ClaimDailyBonusIntent",
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
      processClaimDailyBonus
    ],
    emit: [
      emitIntentResult
    ]
  };
}
