import { validateAuthenticated, validateCourseId, validateCourseMetadataPayload } from "../../stages/validate/validators.js?v=1.1.63-external-task-student-feedback";
import { normalizeCourseId, normalizeCourseMetadata } from "../../stages/normalize/normalizers.js?v=1.1.63-external-task-student-feedback";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { catalogCourseUpdateMetadataProcessing } from "../../stages/process/processors.js?v=1.1.63-external-task-student-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.63-external-task-student-feedback";

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

