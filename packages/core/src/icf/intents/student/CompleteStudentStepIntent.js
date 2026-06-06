import { validateAuthenticated, validatePracticeModeKey, validatePracticeModeStepId } from "../../stages/validate/validators.js?v=1.1.100-student-profile-actor";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.100-student-profile-actor";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.100-student-profile-actor";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.100-student-profile-actor";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.100-student-profile-actor";
import { processCompleteStep } from "../../stages/process/processors.js?v=1.1.100-student-profile-actor";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.100-student-profile-actor";

export function CompleteStudentStepIntent() {
  return {
    type: "CompleteStudentStepIntent",
    validate: [
      validateAuthenticated,
      validateStudentProgressPayload,
      validatePracticeModeKey,
      validatePracticeModeStepId
    ],
    normalize: [
      normalizeStudentProgressPayload
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachStudentSessionContext
    ],
    authorize: [
      requireStudentAuthorization
    ],
    process: [
      processCompleteStep
    ],
    emit: [
      emitIntentResult
    ]
  };
}
