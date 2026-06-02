import { validateAuthenticated, validateCourseId, validateLearningModeId, validateModuleId, validatePracticeModeStepId } from "../../stages/validate/validators.js";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext, attachStepPreviewContext } from "../../stages/addContext/contexts.js?v=1.1.26-buildcheck";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { processPreviewStep } from "../../stages/process/processors.js?v=1.1.26-buildcheck";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function PreviewStepIntent() {
  return {
    type: "PreviewStepIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateModuleId,
      validateLearningModeId,
      validatePracticeModeStepId
    ],
    normalize: [
      normalizeCourseId
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachStepPreviewContext
    ],
    authorize: [
      requireCourseCreatorAuthorization
    ],
    process: [
      processPreviewStep
    ],
    emit: [
      emitIntentResult
    ]
  };
}
