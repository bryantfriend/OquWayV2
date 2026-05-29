import { catalogCourseRequireTitleValidation, catalogCourseRequireVersionValidation } from "../../stages/validate/validators.js";
import { catalogCourseTrimTitleNormalization } from "../../stages/normalize/normalizers.js";
import { attachActorContext } from "../../stages/addContext/contexts.js";
import { attachTimestampContext, attachCreatedByContext } from "../../stages/addContext/contexts.js";
import { attachExistingVersionContext } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js";
import { catalogModuleCreateProcessing } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function CreateCatalogModuleIntent() {
    return {
        type: "CreateCatalogModuleIntent",
        validate: [
            catalogCourseRequireVersionValidation,
            catalogCourseRequireTitleValidation
        ],
        normalize: [
            catalogCourseTrimTitleNormalization
        ],
        addContext: [
            attachActorContext,
            attachTimestampContext,
            attachCreatedByContext,
            attachExistingVersionContext
        ],
        authorize: [
            requireCourseCreatorOwnershipAuthorization
        ],
        process: [
            catalogModuleCreateProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

