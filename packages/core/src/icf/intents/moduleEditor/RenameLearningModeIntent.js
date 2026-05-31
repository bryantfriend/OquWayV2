import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection } from "../../stages/addContext/contexts.js";
import { processRenameLearningMode } from "../../stages/process/processors.js";
import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function RenameLearningModeIntent() {
  return {
    type: "RenameLearningModeIntent",
    validate: [validateAuthenticated, validateCourseId, validateModuleId],
    normalize: [],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection],
    authorize: [requireCourseCreatorAuthorization],
    process: [processRenameLearningMode],
    emit: [emitIntentResult]
  };
}
