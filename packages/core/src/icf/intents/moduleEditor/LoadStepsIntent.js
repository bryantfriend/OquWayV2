import { validateAuthenticated, validateCourseId, validateModuleId, validateSessionId, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.79-user-command-center";
import { attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument, attachSessionDocument } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { processLoadSteps } from "../../stages/process/processors.js?v=1.1.79-user-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.79-user-command-center";

export function LoadStepsIntent() {
  return {
    type: "LoadStepsIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateModuleId,
      validateSessionId,
      validatePracticeModeKey
    ],
    normalize: [],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachCourseDocumentForModule,
      attachModuleDocument,
      attachSessionDocument
    ],
    authorize: [requireCourseCreatorAuthorization],
    process: [processLoadSteps],
    emit: [emitIntentResult]
  };
}
