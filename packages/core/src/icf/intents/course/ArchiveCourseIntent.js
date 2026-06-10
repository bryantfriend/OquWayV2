import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.162-modal-stack";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.162-modal-stack";
import { attachActorContext, attachActorRoleContext, attachTimestampContext, attachUpdatedByContext, attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.162-modal-stack";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.162-modal-stack";
import { catalogCourseArchiveProcessing } from "../../stages/process/processors.js?v=1.1.162-modal-stack";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.162-modal-stack";

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
