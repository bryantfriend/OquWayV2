import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { processDuplicateLearningMode } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

export function DuplicateLearningModeIntent() {
  return {
    type: "DuplicateLearningModeIntent",
    validate: [validateAuthenticated, validateCourseId, validateModuleId],
    normalize: [],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection],
    authorize: [requireCourseCreatorAuthorization],
    process: [processDuplicateLearningMode],
    emit: [emitIntentResult]
  };
}
