import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { processLoadLearningModes } from "../../stages/process/processors.js?v=1.1.113-student-rules-read";
import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js?v=1.1.113-student-rules-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.113-student-rules-read";

export function LoadLearningModesIntent() {
  return {
    type: "LoadLearningModesIntent",
    validate: [validateAuthenticated, validateCourseId, validateModuleId],
    normalize: [],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection],
    authorize: [requireCourseCreatorAuthorization],
    process: [processLoadLearningModes],
    emit: [emitIntentResult]
  };
}
