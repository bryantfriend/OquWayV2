import { catalogCourseRequireTitleValidation, catalogCourseRequireVersionValidation } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { catalogCourseTrimTitleNormalization } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { attachTimestampContext, attachCreatedByContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { attachExistingVersionContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { catalogModuleCreateProcessing } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

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

