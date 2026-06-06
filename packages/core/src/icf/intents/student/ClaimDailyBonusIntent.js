import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.107-student-firebase-auth-chain";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.107-student-firebase-auth-chain";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.107-student-firebase-auth-chain";
import { processClaimDailyBonus } from "../../stages/process/processors.js?v=1.1.107-student-firebase-auth-chain";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.107-student-firebase-auth-chain";

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
