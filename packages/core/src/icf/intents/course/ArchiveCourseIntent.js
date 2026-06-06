import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.80-course-module-command-center";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.80-course-module-command-center";
import { attachActorContext, attachActorRoleContext, attachTimestampContext, attachUpdatedByContext, attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.80-course-module-command-center";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.80-course-module-command-center";
import { catalogCourseArchiveProcessing } from "../../stages/process/processors.js?v=1.1.80-course-module-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.80-course-module-command-center";

export function ArchiveCourseIntent() {
  return {
    type: "ArchiveCourseIntent",
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
    process: [catalogCourseArchiveProcessing],
    emit: [emitIntentResult]
  };
}
