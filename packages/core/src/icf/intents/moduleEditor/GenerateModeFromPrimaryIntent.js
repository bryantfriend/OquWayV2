import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.81-class-command-center";
import { attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection } from "../../stages/addContext/contexts.js?v=1.1.81-class-command-center";
import { processGenerateModeFromPrimary } from "../../stages/process/processors.js?v=1.1.81-class-command-center";
import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js?v=1.1.81-class-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.81-class-command-center";

export function GenerateModeFromPrimaryIntent() {
  return {
    type: "GenerateModeFromPrimaryIntent",
    validate: [validateAuthenticated, validateCourseId, validateModuleId],
    normalize: [],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection],
    authorize: [requireCourseCreatorAuthorization],
    process: [processGenerateModeFromPrimary],
    emit: [emitIntentResult]
  };
}
