import { catalogCourseRequireTitleValidation, catalogCourseRequireVersionValidation } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { catalogCourseTrimTitleNormalization } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { attachTimestampContext, attachCreatedByContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { attachExistingVersionContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { catalogModuleCreateProcessing } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

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

