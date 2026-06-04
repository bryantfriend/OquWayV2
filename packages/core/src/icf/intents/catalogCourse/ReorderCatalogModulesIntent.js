import { catalogCourseRequireVersionValidation } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { catalogCourseNormalizeModuleOrderNormalization } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { attachExistingVersionContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { catalogModuleReorderProcessing } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

export function ReorderCatalogModulesIntent() {
    return {
        type: "ReorderCatalogModulesIntent",
        validate: [
            catalogCourseRequireVersionValidation
        ],
        normalize: [
            catalogCourseNormalizeModuleOrderNormalization
        ],
        addContext: [
            attachActorContext,
            attachTimestampContext,
            attachUpdatedByContext,
            attachExistingVersionContext
        ],
        authorize: [
            requireCourseCreatorOwnershipAuthorization,
            preventModificationIfPublishedAuthorization
        ],
        process: [
            catalogModuleReorderProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

