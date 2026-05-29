import { validateAuthenticated, validateCourseId, validateCourseMetadataPayload } from "../../stages/validate/validators.js";
import { normalizeCourseId, normalizeCourseMetadata } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { attachUpdatedByContext } from "../../stages/addContext/contexts.js";
import { attachCourseDocument } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { catalogCourseUpdateMetadataProcessing } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function UpdateCourseMetadataIntent() {
  return {
    type: "UpdateCourseMetadataIntent",

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
