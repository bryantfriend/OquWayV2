import { catalogCourseRequireTitleValidation, catalogCourseRequireVersionValidation } from "../../stages/validate/validators.js?v=1.1.63-external-task-student-feedback";
import { catalogCourseTrimTitleNormalization } from "../../stages/normalize/normalizers.js?v=1.1.63-external-task-student-feedback";
import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { attachTimestampContext, attachCreatedByContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { attachExistingVersionContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { catalogModuleCreateProcessing } from "../../stages/process/processors.js?v=1.1.63-external-task-student-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.63-external-task-student-feedback";

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

