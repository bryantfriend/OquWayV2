import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.116-student-token-ready";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.116-student-token-ready";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.116-student-token-ready";
import { processClaimDailyBonus } from "../../stages/process/processors.js?v=1.1.116-student-token-ready";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.116-student-token-ready";

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
