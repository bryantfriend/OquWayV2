import { validateAuthenticated, validateCourseId, validateLearningModeId, validateModuleId, validatePracticeModeKey, validatePracticeModeStepId, validateStepMediaField, validateStepMediaFile } from "../../stages/validate/validators.js";
import { normalizeCourseId, normalizeStepMediaUpload } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { attachCourseDocumentForModule, attachLearningModeDocument, attachModuleDocument } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { processUploadStepMedia } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function UploadStepMediaIntent() {
  return {
    type: "UploadStepMediaIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateModuleId,
      validateLearningModeId,
      validatePracticeModeKey,
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
