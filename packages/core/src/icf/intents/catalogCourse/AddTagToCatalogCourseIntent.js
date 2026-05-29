import { catalogCourseRequireTagValidation } from "../../stages/validate/validators.js";
import { catalogCourseNormalizeTagNormalization } from "../../stages/normalize/normalizers.js";
import { attachActorContext } from "../../stages/addContext/contexts.js";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js";
import { catalogCourseAddTagProcessing, catalogCourseUpdateMetadataProcessing } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function AddTagToCatalogCourseIntent() {
    return {
        type: "AddTagToCatalogCourseIntent",
        validate: [
            catalogCourseRequireTagValidation
        ],
        normalize: [
            catalogCourseNormalizeTagNormalization
        ],
        addContext: [
            attachActorContext,
            attachTimestampContext,
            attachUpdatedByContext,
            attachExistingCourseContext
        ],
        authorize: [
            requireCourseCreatorOwnershipAuthorization,
            preventModificationIfPublishedAuthorization
        ],
        process: [
            catalogCourseAddTagProcessing,
            catalogCourseUpdateMetadataProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

