import { catalogCourseRequireModuleIdValidation } from "../../stages/validate/validators.js?v=1.1.117-student-identity-binding";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js?v=1.1.117-student-identity-binding";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.117-student-identity-binding";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.117-student-identity-binding";
import { catalogModuleDeleteProcessing } from "../../stages/process/processors.js?v=1.1.117-student-identity-binding";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.117-student-identity-binding";

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

