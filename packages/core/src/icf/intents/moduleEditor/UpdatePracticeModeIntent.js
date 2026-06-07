import { validateAuthenticated, validateCourseId, validateModuleId, validatePracticeModeKey, validateSessionId } from "../../stages/validate/validators.js?v=1.1.112-student-assignment-error-debug";
import { normalizeCourseId, normalizePracticeModeMetadata } from "../../stages/normalize/normalizers.js?v=1.1.112-student-assignment-error-debug";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.112-student-assignment-error-debug";
import { attachCourseDocumentForModule, attachModuleDocument, attachSessionDocument } from "../../stages/addContext/contexts.js?v=1.1.112-student-assignment-error-debug";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.112-student-assignment-error-debug";
import { processUpdatePracticeMode } from "../../stages/process/processors.js?v=1.1.112-student-assignment-error-debug";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.112-student-assignment-error-debug";

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
