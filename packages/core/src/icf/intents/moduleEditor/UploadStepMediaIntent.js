import { validateAuthenticated, validateCourseId, validateLearningModeId, validateModuleId, validatePracticeModeStepId, validateStepMediaField, validateStepMediaFile } from "../../stages/validate/validators.js?v=1.1.121-student-dashboard-open-clean";
import { normalizeCourseId, normalizeStepMediaUpload } from "../../stages/normalize/normalizers.js?v=1.1.121-student-dashboard-open-clean";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.121-student-dashboard-open-clean";
import { attachCourseDocumentForModule, attachLearningModeDocument, attachModuleDocument } from "../../stages/addContext/contexts.js?v=1.1.121-student-dashboard-open-clean";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.121-student-dashboard-open-clean";
import { processUploadStepMedia } from "../../stages/process/processors.js?v=1.1.121-student-dashboard-open-clean";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.121-student-dashboard-open-clean";

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
