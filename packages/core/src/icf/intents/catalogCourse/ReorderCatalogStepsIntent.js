import { catalogCourseRequireModuleIdValidation } from "../../stages/validate/validators.js";
import { catalogCourseNormalizeStepOrderNormalization } from "../../stages/normalize/normalizers.js";
import { attachActorContext } from "../../stages/addContext/contexts.js";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js";
import { catalogStepReorderProcessing } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function ReorderCatalogStepsIntent() {
    return {
        type: "ReorderCatalogStepsIntent",
        validate: [
            catalogCourseRequireModuleIdValidation
        ],
        normalize: [
            catalogCourseNormalizeStepOrderNormalization
        ],
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
            catalogStepReorderProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

