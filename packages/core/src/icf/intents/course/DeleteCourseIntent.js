import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.114-student-profile-rules";
import { attachActorContext, attachActorRoleContext, attachTimestampContext, attachUpdatedByContext, attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { catalogCourseDeleteProcessing } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

export function DeleteCourseIntent() {
  return {
    type: "DeleteCourseIntent",
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
    process: [catalogCourseDeleteProcessing],
    emit: [emitIntentResult]
  };
}
