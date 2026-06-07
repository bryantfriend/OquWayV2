import { validateAuthenticated, validateCourseId, validateCourseMetadataPayload } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { normalizeCourseId, normalizeCourseMetadata } from "../../stages/normalize/normalizers.js?v=1.1.114-student-profile-rules";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { catalogCourseUpdateMetadataProcessing } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

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
