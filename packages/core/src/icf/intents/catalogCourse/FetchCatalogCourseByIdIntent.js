import { catalogCourseRequireCourseIdValidation } from "../../stages/validate/validators.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { catalogCourseFetchByIdProcessing } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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

