import { catalogCourseRequireModuleIdValidation } from "../../stages/validate/validators.js?v=1.1.162-modal-stack";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.162-modal-stack";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.162-modal-stack";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js?v=1.1.162-modal-stack";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.162-modal-stack";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.162-modal-stack";
import { catalogModuleDeleteProcessing } from "../../stages/process/processors.js?v=1.1.162-modal-stack";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.162-modal-stack";

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

