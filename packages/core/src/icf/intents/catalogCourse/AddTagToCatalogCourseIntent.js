import { catalogCourseRequireTagValidation } from "../../stages/validate/validators.js?v=1.1.113-student-rules-read";
import { catalogCourseNormalizeTagNormalization } from "../../stages/normalize/normalizers.js?v=1.1.113-student-rules-read";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { catalogCourseAddTagProcessing, catalogCourseUpdateMetadataProcessing } from "../../stages/process/processors.js?v=1.1.113-student-rules-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.113-student-rules-read";

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

