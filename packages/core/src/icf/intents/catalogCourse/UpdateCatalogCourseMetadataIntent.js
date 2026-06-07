import { validateAuthenticated, validateCourseId, validateCourseMetadataPayload } from "../../stages/validate/validators.js?v=1.1.116-student-token-ready";
import { normalizeCourseId, normalizeCourseMetadata } from "../../stages/normalize/normalizers.js?v=1.1.116-student-token-ready";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.116-student-token-ready";
import { attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.116-student-token-ready";
import { attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.116-student-token-ready";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.116-student-token-ready";
import { catalogCourseUpdateMetadataProcessing } from "../../stages/process/processors.js?v=1.1.116-student-token-ready";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.116-student-token-ready";

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

