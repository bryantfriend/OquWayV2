import { catalogCourseRequireTagValidation } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { catalogCourseNormalizeTagNormalization } from "../../stages/normalize/normalizers.js?v=1.1.62-external-task-review-loop";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { catalogCourseAddTagProcessing, catalogCourseUpdateMetadataProcessing } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

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

