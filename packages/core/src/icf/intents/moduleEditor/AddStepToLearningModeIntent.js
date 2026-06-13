import { validateAuthenticated, validateCourseId, validateLearningModeId, validateModuleId, validatePracticeModeStepType } from "../../stages/validate/validators.js?v=1.1.184-scenario-choice";
import { normalizeCourseId, normalizePracticeModeStep } from "../../stages/normalize/normalizers.js?v=1.1.184-scenario-choice";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.184-scenario-choice";
import { attachLearningModeDocument } from "../../stages/addContext/contexts.js?v=1.1.184-scenario-choice";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.184-scenario-choice";
import { processAddStepToLearningMode } from "../../stages/process/processors.js?v=1.1.184-scenario-choice";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.184-scenario-choice";

export function AddStepToLearningModeIntent(intentType) {
  return {
    type: intentType || "AddStepToLearningModeIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateModuleId,
      validateLearningModeId,
      validatePracticeModeStepType
    ],
    normalize: [
      normalizeCourseId,
      normalizePracticeModeStep
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachLearningModeDocument
    ],
    authorize: [
      requireCourseCreatorAuthorization
    ],
    process: [
      processAddStepToLearningMode
    ],
    emit: [
      emitIntentResult
    ]
  };
}
