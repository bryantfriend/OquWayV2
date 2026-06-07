import { catalogCourseRequireTitleValidation, catalogCourseRequireVersionValidation } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { catalogCourseTrimTitleNormalization } from "../../stages/normalize/normalizers.js?v=1.1.114-student-profile-rules";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { attachTimestampContext, attachCreatedByContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { attachExistingVersionContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { catalogModuleCreateProcessing } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

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

