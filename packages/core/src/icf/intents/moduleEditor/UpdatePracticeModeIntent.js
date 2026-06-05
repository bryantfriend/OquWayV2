import { validateAuthenticated, validateCourseId, validateModuleId, validatePracticeModeKey, validateSessionId } from "../../stages/validate/validators.js?v=1.1.63-external-task-student-feedback";
import { normalizeCourseId, normalizePracticeModeMetadata } from "../../stages/normalize/normalizers.js?v=1.1.63-external-task-student-feedback";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { attachCourseDocumentForModule, attachModuleDocument, attachSessionDocument } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { processUpdatePracticeMode } from "../../stages/process/processors.js?v=1.1.63-external-task-student-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.63-external-task-student-feedback";

export function UpdatePracticeModeIntent() {
  return {
    type: "UpdatePracticeModeIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateModuleId,
      validateSessionId,
      validatePracticeModeKey
    ],
    normalize: [
      normalizeCourseId,
      normalizePracticeModeMetadata
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachCourseDocumentForModule,
      attachModuleDocument,
      attachSessionDocument
    ],
    authorize: [
      requireCourseCreatorAuthorization
    ],
    process: [
      processUpdatePracticeMode
    ],
    emit: [
      emitIntentResult
    ]
  };
}
