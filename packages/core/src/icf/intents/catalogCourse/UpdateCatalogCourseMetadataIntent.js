import { validateAuthenticated, validateCourseId, validateCourseMetadataPayload } from "../../stages/validate/validators.js?v=1.1.117-student-identity-binding";
import { normalizeCourseId, normalizeCourseMetadata } from "../../stages/normalize/normalizers.js?v=1.1.117-student-identity-binding";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.117-student-identity-binding";
import { catalogCourseUpdateMetadataProcessing } from "../../stages/process/processors.js?v=1.1.117-student-identity-binding";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.117-student-identity-binding";

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

