import { catalogCourseRequireTagValidation } from "../../stages/validate/validators.js?v=1.1.63-external-task-student-feedback";
import { catalogCourseNormalizeTagNormalization } from "../../stages/normalize/normalizers.js?v=1.1.63-external-task-student-feedback";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { catalogCourseAddTagProcessing, catalogCourseUpdateMetadataProcessing } from "../../stages/process/processors.js?v=1.1.63-external-task-student-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.63-external-task-student-feedback";

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

