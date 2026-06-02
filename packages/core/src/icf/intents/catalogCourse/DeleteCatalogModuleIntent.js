import { catalogCourseRequireModuleIdValidation } from "../../stages/validate/validators.js?v=1.1.29-module-render-fix";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.29-module-render-fix";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.29-module-render-fix";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js?v=1.1.29-module-render-fix";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.29-module-render-fix";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.29-module-render-fix";
import { catalogModuleDeleteProcessing } from "../../stages/process/processors.js?v=1.1.29-module-render-fix";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.29-module-render-fix";

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

