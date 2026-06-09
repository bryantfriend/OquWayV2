import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.152-course-builder-loading-timeout";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.152-course-builder-loading-timeout";
import { attachActorContext, attachActorRoleContext, attachTimestampContext, attachUpdatedByContext, attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.152-course-builder-loading-timeout";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.152-course-builder-loading-timeout";
import { catalogCoursePermanentDeleteProcessing } from "../../stages/process/processors.js?v=1.1.152-course-builder-loading-timeout";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.152-course-builder-loading-timeout";

export function PermanentlyDeleteCourseIntent() {
  return {
    type: "PermanentlyDeleteCourseIntent",
    validate: [
      validateAuthenticated,
      validateCourseId
    ],
    normalize: [normalizeCourseId],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachTimestampContext,
      attachUpdatedByContext,
      attachCourseDocument
    ],
    authorize: [requireCourseCreatorAuthorization],
    process: [catalogCoursePermanentDeleteProcessing],
    emit: [emitIntentResult]
  };
}
