import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { processPullLearningContent } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

export function PullLearningContentIntent() {
  return {
    type: "PullLearningContentIntent",
    validate: [validateAuthenticated, validateCourseId, validateModuleId],
    normalize: [],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument],
    authorize: [requireCourseCreatorAuthorization],
    process: [processPullLearningContent],
    emit: [emitIntentResult]
  };
}
