import { catalogCourseRequireModuleIdValidation, catalogCourseValidateStepConfigValidation } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachTimestampContext, attachCreatedByContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { catalogStepCreateProcessing } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

export function CreateCatalogStepIntent() {
    return {
        type: "CreateCatalogStepIntent",
        validate: [
            catalogCourseRequireModuleIdValidation,
            catalogCourseValidateStepConfigValidation
        ],
        normalize: [],
        addContext: [
            attachActorContext,
            attachTimestampContext,
            attachCreatedByContext,
            attachExistingModuleContext
        ],
        authorize: [
            requireCourseCreatorOwnershipAuthorization,
            preventModificationIfPublishedAuthorization
        ],
        process: [
            catalogStepCreateProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

