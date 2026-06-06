import { validateAuthenticated, validateCourseId, validateModuleId, validatePracticeModeKey, validateSessionId } from "../../stages/validate/validators.js?v=1.1.79-user-command-center";
import { normalizeCourseId, normalizePracticeModeMetadata } from "../../stages/normalize/normalizers.js?v=1.1.79-user-command-center";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { attachCourseDocumentForModule, attachModuleDocument, attachSessionDocument } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { processUpdatePracticeMode } from "../../stages/process/processors.js?v=1.1.79-user-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.79-user-command-center";

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
