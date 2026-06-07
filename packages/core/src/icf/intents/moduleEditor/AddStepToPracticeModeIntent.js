import { validateAuthenticated, validateCourseId, validateModuleId, validatePracticeModeKey, validatePracticeModeStepType, validateSessionId } from "../../stages/validate/validators.js?v=1.1.113-student-rules-read";
import { normalizeCourseId, normalizePracticeModeStep } from "../../stages/normalize/normalizers.js?v=1.1.113-student-rules-read";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { attachCourseDocumentForModule, attachModuleDocument, attachSessionDocument, attachSessionsCollection } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { processAddStepToLearningMode } from "../../stages/process/processors.js?v=1.1.113-student-rules-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.113-student-rules-read";

export function AddStepToPracticeModeIntent() {
  return {
    type: "AddStepToPracticeModeIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateModuleId,
      validateSessionId,
      validatePracticeModeKey,
      validatePracticeModeStepType
    ],
    normalize: [
      normalizeCourseId,
      normalizePracticeModeStep
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachCourseDocumentForModule,
      attachModuleDocument,
      attachSessionsCollection,
      attachSessionDocument
    ],
    authorize: [
      requireCourseCreatorAuthorization
    ],
    process: [
      processAddStepToLearningMode
    ],
    emit: [
      emitIntentResult
    ]
  };
}
