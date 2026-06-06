import { catalogCourseRequireCourseIdValidation } from "../../stages/validate/validators.js?v=1.1.79-user-command-center";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { catalogCourseFetchByIdProcessing } from "../../stages/process/processors.js?v=1.1.79-user-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.79-user-command-center";

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

