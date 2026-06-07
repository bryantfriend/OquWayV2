import { catalogCourseRequireCourseIdValidation } from "../../stages/validate/validators.js?v=1.1.112-student-assignment-error-debug";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.112-student-assignment-error-debug";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.112-student-assignment-error-debug";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.112-student-assignment-error-debug";
import { catalogCourseFetchByIdProcessing } from "../../stages/process/processors.js?v=1.1.112-student-assignment-error-debug";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.112-student-assignment-error-debug";

export function FetchCatalogCourseByIdIntent() {
    return {
        type: "FetchCatalogCourseByIdIntent",
        validate: [
            catalogCourseRequireCourseIdValidation
        ],
        normalize: [],
        addContext: [
            attachActorContext,
            attachActorRoleContext,
            attachExistingCourseContext
        ],
        authorize: [
            requireCourseCreatorAuthorization
        ],
        process: [
            catalogCourseFetchByIdProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

