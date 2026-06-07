import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.117-student-identity-binding";
import { attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { processRenameLearningMode } from "../../stages/process/processors.js?v=1.1.117-student-identity-binding";
import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js?v=1.1.117-student-identity-binding";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.117-student-identity-binding";

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
