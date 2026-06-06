import { catalogCourseRequireModuleIdValidation, catalogCourseValidateStepConfigValidation } from "../../stages/validate/validators.js?v=1.1.79-user-command-center";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { attachTimestampContext, attachCreatedByContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { catalogStepCreateProcessing } from "../../stages/process/processors.js?v=1.1.79-user-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.79-user-command-center";

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

