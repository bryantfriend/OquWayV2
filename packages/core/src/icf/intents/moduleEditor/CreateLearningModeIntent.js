import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { processCreateLearningMode } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

export function CreateLearningModeIntent() {
  return {
    type: "CreateLearningModeIntent",
    validate: [validateAuthenticated, validateCourseId, validateModuleId],
    normalize: [],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection],
    authorize: [requireCourseCreatorAuthorization],
    process: [processCreateLearningMode],
    emit: [emitIntentResult]
  };
}
