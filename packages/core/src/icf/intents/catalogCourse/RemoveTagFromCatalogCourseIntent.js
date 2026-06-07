import { catalogCourseRequireTagValidation } from "../../stages/validate/validators.js?v=1.1.121-student-dashboard-open-clean";
import { catalogCourseNormalizeTagNormalization } from "../../stages/normalize/normalizers.js?v=1.1.121-student-dashboard-open-clean";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.121-student-dashboard-open-clean";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.121-student-dashboard-open-clean";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.121-student-dashboard-open-clean";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.121-student-dashboard-open-clean";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.121-student-dashboard-open-clean";
import { catalogCourseRemoveTagProcessing, catalogCourseUpdateMetadataProcessing } from "../../stages/process/processors.js?v=1.1.121-student-dashboard-open-clean";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.121-student-dashboard-open-clean";

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

