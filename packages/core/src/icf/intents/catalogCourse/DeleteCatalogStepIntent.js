import { catalogCourseRequireStepIdValidation } from "../../stages/validate/validators.js?v=1.1.63-external-task-student-feedback";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { attachExistingStepContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { catalogStepDeleteProcessing } from "../../stages/process/processors.js?v=1.1.63-external-task-student-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.63-external-task-student-feedback";

export function DeleteCatalogStepIntent() {
    return {
        type: "DeleteCatalogStepIntent",
        validate: [
            catalogCourseRequireStepIdValidation
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
            catalogStepDeleteProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

