import { catalogCourseRequireModuleIdValidation } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { catalogCourseNormalizeStepOrderNormalization } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { catalogStepReorderProcessing } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

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

