import { catalogCourseRequireTagValidation } from "../../stages/validate/validators.js?v=1.1.119-student-dashboard-debug-safe";
import { catalogCourseNormalizeTagNormalization } from "../../stages/normalize/normalizers.js?v=1.1.119-student-dashboard-debug-safe";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.119-student-dashboard-debug-safe";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.119-student-dashboard-debug-safe";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.119-student-dashboard-debug-safe";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.119-student-dashboard-debug-safe";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.119-student-dashboard-debug-safe";
import { catalogCourseRemoveTagProcessing, catalogCourseUpdateMetadataProcessing } from "../../stages/process/processors.js?v=1.1.119-student-dashboard-debug-safe";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.119-student-dashboard-debug-safe";

export function RemoveTagFromCatalogCourseIntent() {
    return {
        type: "RemoveTagFromCatalogCourseIntent",
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
            catalogCourseRemoveTagProcessing,
            catalogCourseUpdateMetadataProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

