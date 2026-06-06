import { catalogCourseRequireModuleIdValidation } from "../../stages/validate/validators.js?v=1.1.108-student-class-alias-merge";
import { catalogCourseNormalizeStepOrderNormalization } from "../../stages/normalize/normalizers.js?v=1.1.108-student-class-alias-merge";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.108-student-class-alias-merge";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.108-student-class-alias-merge";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js?v=1.1.108-student-class-alias-merge";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.108-student-class-alias-merge";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.108-student-class-alias-merge";
import { catalogStepReorderProcessing } from "../../stages/process/processors.js?v=1.1.108-student-class-alias-merge";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.108-student-class-alias-merge";

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

