import { catalogCourseRequireVersionValidation } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { catalogCourseNormalizeModuleOrderNormalization } from "../../stages/normalize/normalizers.js?v=1.1.114-student-profile-rules";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { attachExistingVersionContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { catalogModuleReorderProcessing } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

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

