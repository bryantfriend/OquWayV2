import { validateAuthenticated, validateCourseId, validateLearningModeId, validateModuleId, validatePracticeModeStepId, validateStepMediaField, validateStepMediaFile } from "../../stages/validate/validators.js";
import { normalizeCourseId, normalizeStepMediaUpload } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.26-buildcheck";
import { attachCourseDocumentForModule, attachLearningModeDocument, attachModuleDocument } from "../../stages/addContext/contexts.js?v=1.1.26-buildcheck";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { processUploadStepMedia } from "../../stages/process/processors.js?v=1.1.26-buildcheck";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function UploadStepMediaIntent() {
  return {
    type: "UploadStepMediaIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateModuleId,
      validateLearningModeId,
      validatePracticeModeStepId,
      validateStepMediaField,
      validateStepMediaFile
    ],
    normalize: [
      normalizeCourseId,
      normalizeStepMediaUpload
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachCourseDocumentForModule,
      attachModuleDocument,
      attachLearningModeDocument
    ],
    authorize: [
      requireCourseCreatorAuthorization
    ],
    process: [
      processUploadStepMedia
    ],
    emit: [
      emitIntentResult
    ]
  };
}
