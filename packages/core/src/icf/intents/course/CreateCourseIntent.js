import { validateAuthenticated, validateCourseMetadataPayload }
  from "../../stages/validate/validators.js?v=1.1.112-student-assignment-error-debug";
import { normalizeCourseMetadata } from "../../stages/normalize/normalizers.js?v=1.1.112-student-assignment-error-debug";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.112-student-assignment-error-debug";
import { attachTenantContext } from "../../stages/addContext/contexts.js?v=1.1.112-student-assignment-error-debug";
import { attachCreatedByContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.112-student-assignment-error-debug";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.112-student-assignment-error-debug";
import { catalogCourseCreateRecordProcessing } from "../../stages/process/processors.js?v=1.1.112-student-assignment-error-debug";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.112-student-assignment-error-debug";

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
