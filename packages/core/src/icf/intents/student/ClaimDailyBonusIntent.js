import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.79-user-command-center";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { processClaimDailyBonus } from "../../stages/process/processors.js?v=1.1.79-user-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.79-user-command-center";

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
