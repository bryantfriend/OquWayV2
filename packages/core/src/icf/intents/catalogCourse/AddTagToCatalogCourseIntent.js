import { catalogCourseRequireTagValidation } from "../../stages/validate/validators.js?v=1.1.79-user-command-center";
import { catalogCourseNormalizeTagNormalization } from "../../stages/normalize/normalizers.js?v=1.1.79-user-command-center";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { catalogCourseAddTagProcessing, catalogCourseUpdateMetadataProcessing } from "../../stages/process/processors.js?v=1.1.79-user-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.79-user-command-center";

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

