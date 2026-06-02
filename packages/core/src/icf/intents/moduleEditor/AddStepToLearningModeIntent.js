import { validateAuthenticated, validateCourseId, validateLearningModeId, validateModuleId, validatePracticeModeStepType } from "../../stages/validate/validators.js";
import { normalizeCourseId, normalizePracticeModeStep } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { attachLearningModeDocument } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { processAddStepToLearningMode } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
