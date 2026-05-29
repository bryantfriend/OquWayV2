import { validateAuthenticated, validateCourseMetadataPayload }
  from "../../stages/validate/validators.js";
import { normalizeCourseMetadata } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { attachTenantContext } from "../../stages/addContext/contexts.js";
import { attachCreatedByContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { catalogCourseCreateRecordProcessing } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
