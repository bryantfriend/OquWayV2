import { catalogCourseRequireVersionValidation } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { catalogCourseNormalizeModuleOrderNormalization } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { attachExistingVersionContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { catalogModuleReorderProcessing } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

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

