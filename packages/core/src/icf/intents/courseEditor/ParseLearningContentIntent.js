import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.119-student-dashboard-debug-safe";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.119-student-dashboard-debug-safe";
import { attachActorContext, attachActorRoleContext, attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.119-student-dashboard-debug-safe";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.119-student-dashboard-debug-safe";
import { processParseLearningContent } from "../../stages/process/processors.js?v=1.1.119-student-dashboard-debug-safe";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.119-student-dashboard-debug-safe";

export function ParseLearningContentIntent() {
  return {
    type: "ParseLearningContentIntent",
    validate: [validateAuthenticated, validateCourseId],
    normalize: [normalizeCourseId],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseDocument],
    authorize: [requireCourseCreatorAuthorization],
    process: [processParseLearningContent],
    emit: [emitIntentResult]
  };
}
