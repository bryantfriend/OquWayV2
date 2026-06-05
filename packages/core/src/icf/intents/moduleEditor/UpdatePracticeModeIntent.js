import { validateAuthenticated, validateCourseId, validateModuleId, validatePracticeModeKey, validateSessionId } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { normalizeCourseId, normalizePracticeModeMetadata } from "../../stages/normalize/normalizers.js?v=1.1.62-external-task-review-loop";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachCourseDocumentForModule, attachModuleDocument, attachSessionDocument } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { processUpdatePracticeMode } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

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
