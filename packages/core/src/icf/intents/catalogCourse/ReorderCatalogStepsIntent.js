import { catalogCourseRequireModuleIdValidation } from "../../stages/validate/validators.js?v=1.1.219-course-creator-all-courses";
import { catalogCourseNormalizeStepOrderNormalization } from "../../stages/normalize/normalizers.js?v=1.1.219-course-creator-all-courses";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.219-course-creator-all-courses";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.219-course-creator-all-courses";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js?v=1.1.219-course-creator-all-courses";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.219-course-creator-all-courses";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.219-course-creator-all-courses";
import { catalogStepReorderProcessing } from "../../stages/process/processors.js?v=1.1.219-course-creator-all-courses";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.219-course-creator-all-courses";

export function ReorderCatalogStepsIntent() {
    return {
        type: "ReorderCatalogStepsIntent",
        validate: [
            catalogCourseRequireModuleIdValidation
        ],
        normalize: [
            catalogCourseNormalizeStepOrderNormalization
        ],
        addContext: [
            attachActorContext,
            attachTimestampContext,
            attachUpdatedByContext,
            attachExistingModuleContext
        ],
        authorize: [
            requireCourseCreatorOwnershipAuthorization,
            preventModificationIfPublishedAuthorization
        ],
        process: [
            catalogStepReorderProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

