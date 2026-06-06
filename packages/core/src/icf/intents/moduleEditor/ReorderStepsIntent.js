import { validateAuthenticated, validateCourseId, validateModuleId, validatePracticeModeKey, validateSessionId } from "../../stages/validate/validators.js?v=1.1.79-user-command-center";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.79-user-command-center";
import { attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument, attachSessionDocument } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { processReorderPracticeModeSteps } from "../../stages/process/processors.js?v=1.1.79-user-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.79-user-command-center";

export function ReorderStepsIntent() {
  return {
    type: "ReorderStepsIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateModuleId,
      validateSessionId,
      validatePracticeModeKey
    ],
    normalize: [normalizeCourseId],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachCourseDocumentForModule,
      attachModuleDocument,
      attachSessionDocument
    ],
    authorize: [requireCourseCreatorAuthorization],
    process: [processReorderPracticeModeSteps],
    emit: [emitIntentResult]
  };
}
