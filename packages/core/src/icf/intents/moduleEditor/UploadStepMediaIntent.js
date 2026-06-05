import { validateAuthenticated, validateCourseId, validateLearningModeId, validateModuleId, validatePracticeModeStepId, validateStepMediaField, validateStepMediaFile } from "../../stages/validate/validators.js?v=1.1.63-external-task-student-feedback";
import { normalizeCourseId, normalizeStepMediaUpload } from "../../stages/normalize/normalizers.js?v=1.1.63-external-task-student-feedback";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { attachCourseDocumentForModule, attachLearningModeDocument, attachModuleDocument } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { processUploadStepMedia } from "../../stages/process/processors.js?v=1.1.63-external-task-student-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.63-external-task-student-feedback";

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
