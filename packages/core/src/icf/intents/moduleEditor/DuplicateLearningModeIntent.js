import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection } from "../../stages/addContext/contexts.js";
import { processDuplicateLearningMode } from "../../stages/process/processors.js";
import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
