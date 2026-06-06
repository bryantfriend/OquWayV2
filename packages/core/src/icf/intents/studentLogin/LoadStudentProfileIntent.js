import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.100-student-profile-actor";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.100-student-profile-actor";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.100-student-profile-actor";
import { processLoadStudentProfile } from "../../stages/process/processors.js?v=1.1.100-student-profile-actor";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.100-student-profile-actor";

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
