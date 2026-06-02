import { validateAuthenticated, validateCourseId, validateLearningModeId, validateModuleId, validatePracticeModeStepType } from "../../stages/validate/validators.js?v=1.1.29-module-render-fix";
import { normalizeCourseId, normalizePracticeModeStep } from "../../stages/normalize/normalizers.js?v=1.1.29-module-render-fix";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.29-module-render-fix";
import { attachLearningModeDocument } from "../../stages/addContext/contexts.js?v=1.1.29-module-render-fix";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.29-module-render-fix";
import { processAddStepToLearningMode } from "../../stages/process/processors.js?v=1.1.29-module-render-fix";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.29-module-render-fix";

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
