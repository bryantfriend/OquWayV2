import { validateAuthenticated, validateCourseId, validateCourseMetadataPayload } from "../../stages/validate/validators.js?v=1.1.120-student-course-debug-summary";
import { normalizeCourseId, normalizeCourseMetadata } from "../../stages/normalize/normalizers.js?v=1.1.120-student-course-debug-summary";
import { attachActorContext, attachActorRoleContext, attachUpdatedByContext, attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.120-student-course-debug-summary";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.120-student-course-debug-summary";
import { catalogCourseUpdateMetadataProcessing } from "../../stages/process/processors.js?v=1.1.120-student-course-debug-summary";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.120-student-course-debug-summary";

export function UpdateCourseIntent() {
  return {
    type: "UpdateCourseIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateCourseMetadataPayload
    ],
    normalize: [
      normalizeCourseId,
      normalizeCourseMetadata
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachUpdatedByContext,
      attachCourseDocument
    ],
    authorize: [
      requireCourseCreatorAuthorization
    ],
    process: [
      catalogCourseUpdateMetadataProcessing
    ],
    emit: [
      emitIntentResult
    ]
  };
}
