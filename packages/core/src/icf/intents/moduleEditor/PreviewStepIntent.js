import { validateAuthenticated, validateCourseId, validateLearningModeId, validateModuleId, validatePracticeModeStepId } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { attachActorContext, attachActorRoleContext, attachStepPreviewContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processPreviewStep } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

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
