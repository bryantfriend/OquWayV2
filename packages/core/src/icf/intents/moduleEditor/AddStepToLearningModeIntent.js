import { validateAuthenticated, validateCourseId, validateLearningModeId, validateModuleId, validatePracticeModeStepType } from "../../stages/validate/validators.js?v=1.1.183-multi-select-step";
import { normalizeCourseId, normalizePracticeModeStep } from "../../stages/normalize/normalizers.js?v=1.1.183-multi-select-step";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.183-multi-select-step";
import { attachLearningModeDocument } from "../../stages/addContext/contexts.js?v=1.1.183-multi-select-step";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.183-multi-select-step";
import { processAddStepToLearningMode } from "../../stages/process/processors.js?v=1.1.183-multi-select-step";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.183-multi-select-step";

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
