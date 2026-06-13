import { validateAuthenticated, validateCourseId, validateModuleId, validatePracticeModeKey, validatePracticeModeStepId, validateSessionId } from "../../stages/validate/validators.js?v=1.1.184-scenario-choice";
import { normalizeCourseId, normalizePracticeModeStep } from "../../stages/normalize/normalizers.js?v=1.1.184-scenario-choice";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.184-scenario-choice";
import { attachCourseDocumentForModule, attachModuleDocument, attachSessionDocument } from "../../stages/addContext/contexts.js?v=1.1.184-scenario-choice";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.184-scenario-choice";
import { processUpdatePracticeModeStep } from "../../stages/process/processors.js?v=1.1.184-scenario-choice";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.184-scenario-choice";

export function UpdatePracticeModeStepIntent() {
  return {
    type: "UpdatePracticeModeStepIntent",
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
    authorize: [
      requireCourseCreatorAuthorization
    ],
    process: [
      processUpdatePracticeModeStep
    ],
    emit: [
      emitIntentResult
    ]
  };
}
