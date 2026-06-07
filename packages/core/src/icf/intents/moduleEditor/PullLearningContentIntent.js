import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.120-student-course-debug-summary";
import { attachActorContext, attachActorRoleContext, attachCourseDocumentForModule, attachModuleDocument } from "../../stages/addContext/contexts.js?v=1.1.120-student-course-debug-summary";
import { processPullLearningContent } from "../../stages/process/processors.js?v=1.1.120-student-course-debug-summary";
import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js?v=1.1.120-student-course-debug-summary";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.120-student-course-debug-summary";

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
