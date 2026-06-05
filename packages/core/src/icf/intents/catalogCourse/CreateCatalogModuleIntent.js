import { catalogCourseRequireTitleValidation, catalogCourseRequireVersionValidation } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { catalogCourseTrimTitleNormalization } from "../../stages/normalize/normalizers.js?v=1.1.62-external-task-review-loop";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachTimestampContext, attachCreatedByContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachExistingVersionContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { catalogModuleCreateProcessing } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

export function CreateCatalogModuleIntent() {
    return {
        type: "CreateCatalogModuleIntent",
        validate: [
            catalogCourseRequireVersionValidation,
            catalogCourseRequireTitleValidation
        ],
        normalize: [
            catalogCourseTrimTitleNormalization
        ],
        addContext: [
            attachActorContext,
            attachTimestampContext,
            attachCreatedByContext,
            attachExistingVersionContext
        ],
        authorize: [
            requireCourseCreatorOwnershipAuthorization
        ],
        process: [
            catalogModuleCreateProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

