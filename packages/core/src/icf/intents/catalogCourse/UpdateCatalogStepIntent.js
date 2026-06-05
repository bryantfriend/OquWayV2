import { catalogCourseRequireStepIdValidation, catalogCourseValidateStepConfigValidation } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachExistingStepContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { catalogStepUpdateProcessing } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

export function UpdateCatalogStepIntent() {
    return {
        type: "UpdateCatalogStepIntent",
        validate: [
            catalogCourseRequireStepIdValidation,
            catalogCourseValidateStepConfigValidation
        ],
        normalize: [],
        addContext: [
            attachActorContext,
            attachTimestampContext,
            attachUpdatedByContext,
            attachExistingStepContext
        ],
        authorize: [
            requireCourseCreatorOwnershipAuthorization,
            preventModificationIfPublishedAuthorization
        ],
        process: [
            catalogStepUpdateProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

