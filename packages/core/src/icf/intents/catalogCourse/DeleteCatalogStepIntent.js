import { catalogCourseRequireStepIdValidation } from "../../stages/validate/validators.js?v=1.1.79-user-command-center";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { attachExistingStepContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { catalogStepDeleteProcessing } from "../../stages/process/processors.js?v=1.1.79-user-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.79-user-command-center";

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

