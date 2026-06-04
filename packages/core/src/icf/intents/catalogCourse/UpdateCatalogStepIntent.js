import { catalogCourseRequireStepIdValidation, catalogCourseValidateStepConfigValidation } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { attachExistingStepContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { catalogStepUpdateProcessing } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

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

