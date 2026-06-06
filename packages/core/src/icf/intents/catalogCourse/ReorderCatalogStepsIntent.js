import { catalogCourseRequireModuleIdValidation } from "../../stages/validate/validators.js?v=1.1.81-class-command-center";
import { catalogCourseNormalizeStepOrderNormalization } from "../../stages/normalize/normalizers.js?v=1.1.81-class-command-center";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.81-class-command-center";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.81-class-command-center";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js?v=1.1.81-class-command-center";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.81-class-command-center";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.81-class-command-center";
import { catalogStepReorderProcessing } from "../../stages/process/processors.js?v=1.1.81-class-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.81-class-command-center";

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

