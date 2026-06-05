import { catalogCourseRequireModuleIdValidation } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { catalogCourseNormalizeStepOrderNormalization } from "../../stages/normalize/normalizers.js?v=1.1.62-external-task-review-loop";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { catalogStepReorderProcessing } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

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

