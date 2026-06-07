import { catalogCourseRequireModuleIdValidation } from "../../stages/validate/validators.js?v=1.1.112-student-assignment-error-debug";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.112-student-assignment-error-debug";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.112-student-assignment-error-debug";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js?v=1.1.112-student-assignment-error-debug";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.112-student-assignment-error-debug";
import { preventModificationIfPublishedAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.112-student-assignment-error-debug";
import { catalogModuleDeleteProcessing } from "../../stages/process/processors.js?v=1.1.112-student-assignment-error-debug";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.112-student-assignment-error-debug";

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

