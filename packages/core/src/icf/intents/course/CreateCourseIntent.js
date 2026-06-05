import { validateAuthenticated, validateCourseMetadataPayload }
  from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { normalizeCourseMetadata } from "../../stages/normalize/normalizers.js?v=1.1.62-external-task-review-loop";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachTenantContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachCreatedByContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { catalogCourseCreateRecordProcessing } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

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
