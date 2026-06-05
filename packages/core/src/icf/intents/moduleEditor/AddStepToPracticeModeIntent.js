import { validateAuthenticated, validateCourseId, validateModuleId, validatePracticeModeKey, validatePracticeModeStepType, validateSessionId } from "../../stages/validate/validators.js?v=1.1.63-external-task-student-feedback";
import { normalizeCourseId, normalizePracticeModeStep } from "../../stages/normalize/normalizers.js?v=1.1.63-external-task-student-feedback";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { attachCourseDocumentForModule, attachModuleDocument, attachSessionDocument, attachSessionsCollection } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { processAddStepToLearningMode } from "../../stages/process/processors.js?v=1.1.63-external-task-student-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.63-external-task-student-feedback";

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
