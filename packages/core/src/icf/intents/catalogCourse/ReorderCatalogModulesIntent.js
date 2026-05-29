import { catalogCourseRequireVersionValidation } from "../../stages/validate/validators.js";
import { catalogCourseNormalizeModuleOrderNormalization } from "../../stages/normalize/normalizers.js";
import { attachActorContext } from "../../stages/addContext/contexts.js";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js";
import { attachExistingVersionContext } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js";
import { catalogModuleReorderProcessing } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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

