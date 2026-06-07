import { validateAuthenticated, validateCourseId, validateCourseMetadataPayload } from "../../stages/validate/validators.js?v=1.1.121-student-dashboard-open-clean";
import { normalizeCourseId, normalizeCourseMetadata } from "../../stages/normalize/normalizers.js?v=1.1.121-student-dashboard-open-clean";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.121-student-dashboard-open-clean";
import { attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.121-student-dashboard-open-clean";
import { attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.121-student-dashboard-open-clean";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.121-student-dashboard-open-clean";
import { catalogCourseUpdateMetadataProcessing } from "../../stages/process/processors.js?v=1.1.121-student-dashboard-open-clean";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.121-student-dashboard-open-clean";

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
