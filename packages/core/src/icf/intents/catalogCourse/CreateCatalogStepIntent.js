import { catalogCourseRequireModuleIdValidation, catalogCourseValidateStepConfigValidation } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { attachTimestampContext, attachCreatedByContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { catalogStepCreateProcessing } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

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

