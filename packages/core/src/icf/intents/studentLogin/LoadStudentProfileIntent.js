import { validateAuthenticated } from "../../stages/validate/validators.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js";
import { processLoadStudentProfile } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
