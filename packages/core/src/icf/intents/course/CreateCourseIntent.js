import { validateAuthenticated, validateCourseMetadataPayload }
  from "../../stages/validate/validators.js?v=1.1.124-location-icon-upload";
import { normalizeCourseMetadata } from "../../stages/normalize/normalizers.js?v=1.1.124-location-icon-upload";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.124-location-icon-upload";
import { attachTenantContext } from "../../stages/addContext/contexts.js?v=1.1.124-location-icon-upload";
import { attachCreatedByContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.124-location-icon-upload";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.124-location-icon-upload";
import { catalogCourseCreateRecordProcessing } from "../../stages/process/processors.js?v=1.1.137-emotional-preview-editor";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.124-location-icon-upload";

export function CreateCourseIntent() {
  return {
    type: "CreateCourseIntent",

    validate: [
      validateAuthenticated,
      validateCourseMetadataPayload
    ],

    normalize: [
      normalizeCourseMetadata
    ],

    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachTenantContext,
      attachCreatedByContext,
      attachUpdatedByContext
    ],

    authorize: [
      requireCourseCreatorAuthorization
    ],

    process: [
      catalogCourseCreateRecordProcessing
    ],

    emit: [
      emitIntentResult
    ]
  };
}
