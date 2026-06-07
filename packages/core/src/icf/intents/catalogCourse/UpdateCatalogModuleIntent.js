import { catalogCourseRequireTitleValidation, catalogCourseRequireModuleIdValidation } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { catalogCourseTrimTitleNormalization } from "../../stages/normalize/normalizers.js?v=1.1.114-student-profile-rules";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { attachExistingModuleContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { catalogModuleUpdateProcessing } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

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

