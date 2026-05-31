import { validateAuthenticated, validateCourseId, validateCourseMetadataPayload } from "../../stages/validate/validators.js";
import { normalizeCourseId, normalizeCourseMetadata } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext, attachUpdatedByContext, attachCourseDocument } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { catalogCourseUpdateMetadataProcessing } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
