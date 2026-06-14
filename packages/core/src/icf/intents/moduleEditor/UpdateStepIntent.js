import { validateAuthenticated, validateCourseId, validateModuleId, validatePracticeModeKey, validatePracticeModeStepId, validateSessionId } from "../../stages/validate/validators.js?v=1.1.192-timed-sequence";
import { normalizeCourseId, normalizePracticeModeStep } from "../../stages/normalize/normalizers.js?v=1.1.192-timed-sequence";
import { attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument, attachSessionDocument } from "../../stages/addContext/contexts.js?v=1.1.192-timed-sequence";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.192-timed-sequence";
import { processUpdatePracticeModeStep } from "../../stages/process/processors.js?v=1.1.192-timed-sequence";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.192-timed-sequence";

export function UpdateStepIntent() {
  return {
    type: "UpdateStepIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateModuleId,
      validateSessionId,
      validatePracticeModeKey,
      validatePracticeModeStepId
    ],
    normalize: [
      normalizeCourseId,
      normalizePracticeModeStep
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachCourseDocumentForModule,
      attachModuleDocument,
      attachSessionDocument
    ],
    authorize: [requireCourseCreatorAuthorization],
    process: [processUpdatePracticeModeStep],
    emit: [emitIntentResult]
  };
}
