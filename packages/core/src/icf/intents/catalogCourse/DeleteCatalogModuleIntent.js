import { catalogCourseRequireModuleIdValidation } from "../../stages/validate/validators.js";
import { attachActorContext } from "../../stages/addContext/contexts.js";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js";
import { catalogModuleDeleteProcessing } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function DeleteCatalogModuleIntent() {
    return {
        type: "DeleteCatalogModuleIntent",
        validate: [
            catalogCourseRequireModuleIdValidation
        ],
        normalize: [],
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
            catalogModuleDeleteProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

