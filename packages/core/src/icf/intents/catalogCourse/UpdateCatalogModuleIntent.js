import { catalogCourseRequireTitleValidation, catalogCourseRequireModuleIdValidation } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { catalogCourseTrimTitleNormalization } from "../../stages/normalize/normalizers.js?v=1.1.62-external-task-review-loop";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { catalogModuleUpdateProcessing } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

export function UpdateCatalogModuleIntent() {
    return {
        type: "UpdateCatalogModuleIntent",
        validate: [
            catalogCourseRequireModuleIdValidation,
            catalogCourseRequireTitleValidation
        ],
        normalize: [
            catalogCourseTrimTitleNormalization
        ],
        addContext: [
            attachActorContext,
            attachTimestampContext,
            attachUpdatedByContext,
            attachExistingModuleContext
        ],
        authorize: [
            requireCourseCreatorOwnershipAuthorization
        ],
        process: [
            catalogModuleUpdateProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

