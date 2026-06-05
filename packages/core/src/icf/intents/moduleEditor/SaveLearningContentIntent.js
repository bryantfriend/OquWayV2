import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { processSaveLearningContent } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

export function SaveLearningContentIntent() {
  return {
    type: "SaveLearningContentIntent",
    validate: [validateAuthenticated, validateCourseId, validateModuleId],
    normalize: [],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument],
    authorize: [requireCourseCreatorAuthorization],
    process: [processSaveLearningContent],
    emit: [emitIntentResult]
  };
}
