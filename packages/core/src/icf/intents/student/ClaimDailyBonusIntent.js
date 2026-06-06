import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.102-student-profile-payload";
import { attachActorContext, attachActorRoleContext, attachStudentProfileContext } from "../../stages/addContext/contexts.js?v=1.1.102-student-profile-payload";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.102-student-profile-payload";
import { processClaimDailyBonus } from "../../stages/process/processors.js?v=1.1.102-student-profile-payload";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.102-student-profile-payload";

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
