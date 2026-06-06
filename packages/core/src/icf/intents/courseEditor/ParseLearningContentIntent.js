import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.109-student-assignment-status-fallback";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.109-student-assignment-status-fallback";
import { attachActorContext, attachActorRoleContext, attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.109-student-assignment-status-fallback";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.109-student-assignment-status-fallback";
import { processParseLearningContent } from "../../stages/process/processors.js?v=1.1.109-student-assignment-status-fallback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.109-student-assignment-status-fallback";

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
