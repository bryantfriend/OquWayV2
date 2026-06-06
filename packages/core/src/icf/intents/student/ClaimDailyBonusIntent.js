import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.106-student-assignment-error-trace";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.106-student-assignment-error-trace";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.106-student-assignment-error-trace";
import { processClaimDailyBonus } from "../../stages/process/processors.js?v=1.1.106-student-assignment-error-trace";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.106-student-assignment-error-trace";

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
