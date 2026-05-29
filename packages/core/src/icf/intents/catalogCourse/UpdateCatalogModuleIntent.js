import { catalogCourseRequireTitleValidation, catalogCourseRequireModuleIdValidation } from "../../stages/validate/validators.js";
import { catalogCourseTrimTitleNormalization } from "../../stages/normalize/normalizers.js";
import { attachActorContext } from "../../stages/addContext/contexts.js";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js";
import { catalogModuleUpdateProcessing } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function UpdateCatalogModuleIntent() {
    return {
        type: "UpdateCatalogModuleIntent",
        validate: [
            catalogCourseRequireModuleIdValidation,
            catalogCourseRequireTitleValidation
        ],
        normalize: [
            catalogCourseTrimTitleNormalization
        ],
        addContext: [
            attachActorContext,
            attachTimestampContext,
            attachUpdatedByContext,
            attachExistingModuleContext
        ],
        authorize: [
            requireCourseCreatorOwnershipAuthorization
        ],
        process: [
            catalogModuleUpdateProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

