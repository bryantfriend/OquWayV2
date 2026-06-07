import { validateAuthenticated, validateCourseId, validateModuleId, validatePracticeModeKey, validatePracticeModeStepId, validateSessionId } from "../../stages/validate/validators.js?v=1.1.117-student-identity-binding";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.117-student-identity-binding";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { attachCourseDocumentForModule, attachModuleDocument, attachSessionDocument } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.117-student-identity-binding";
import { processDeletePracticeModeStep } from "../../stages/process/processors.js?v=1.1.117-student-identity-binding";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.117-student-identity-binding";

export function DeletePracticeModeStepIntent() {
  return {
    type: "DeletePracticeModeStepIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateModuleId,
      validateSessionId,
      validatePracticeModeKey,
      validatePracticeModeStepId
    ],
    normalize: [
      normalizeCourseId
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachCourseDocumentForModule,
      attachModuleDocument,
      attachSessionDocument
    ],
    authorize: [
      requireCourseCreatorAuthorization
    ],
    process: [
      processDeletePracticeModeStep
    ],
    emit: [
      emitIntentResult
    ]
  };
}
