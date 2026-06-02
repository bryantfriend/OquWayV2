import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.29-module-render-fix";
import { attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection } from "../../stages/addContext/contexts.js?v=1.1.29-module-render-fix";
import { processCreateLearningMode } from "../../stages/process/processors.js?v=1.1.29-module-render-fix";
import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js?v=1.1.29-module-render-fix";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.29-module-render-fix";

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
