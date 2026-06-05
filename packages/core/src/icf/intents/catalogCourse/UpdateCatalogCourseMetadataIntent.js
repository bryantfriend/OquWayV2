import { validateAuthenticated, validateCourseId, validateCourseMetadataPayload } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { normalizeCourseId, normalizeCourseMetadata } from "../../stages/normalize/normalizers.js?v=1.1.62-external-task-review-loop";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { catalogCourseUpdateMetadataProcessing } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

export function UpdateCatalogCourseMetadataIntent() {
    return {
        type: "UpdateCatalogCourseMetadataIntent",
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
            attachUpdatedByContext,
            attachActorRoleContext,
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

