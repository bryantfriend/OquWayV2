import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { processLoadLearningContent } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

export function LoadLearningContentIntent() {
  return {
    type: "LoadLearningContentIntent",
    validate: [validateAuthenticated, validateCourseId, validateModuleId],
    normalize: [],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument],
    authorize: [requireCourseCreatorAuthorization],
    process: [processLoadLearningContent],
    emit: [emitIntentResult]
  };
}
