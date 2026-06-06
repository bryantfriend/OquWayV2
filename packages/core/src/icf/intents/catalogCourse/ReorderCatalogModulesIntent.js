import { catalogCourseRequireVersionValidation } from "../../stages/validate/validators.js?v=1.1.79-user-command-center";
import { catalogCourseNormalizeModuleOrderNormalization } from "../../stages/normalize/normalizers.js?v=1.1.79-user-command-center";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { attachExistingVersionContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { catalogModuleReorderProcessing } from "../../stages/process/processors.js?v=1.1.79-user-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.79-user-command-center";

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

