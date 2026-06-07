import { validateAuthenticated, validateCourseId, validateLearningModeId, validateModuleId, validatePracticeModeStepId } from "../../stages/validate/validators.js?v=1.1.118-fruit-login-student-identity";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.118-fruit-login-student-identity";
import { attachActorContext, attachActorRoleContext, attachStepPreviewContext } from "../../stages/addContext/contexts.js?v=1.1.118-fruit-login-student-identity";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.118-fruit-login-student-identity";
import { processPreviewStep } from "../../stages/process/processors.js?v=1.1.118-fruit-login-student-identity";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.118-fruit-login-student-identity";

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
