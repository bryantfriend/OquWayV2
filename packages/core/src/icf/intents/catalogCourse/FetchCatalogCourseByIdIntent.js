import { catalogCourseRequireCourseIdValidation } from "../../stages/validate/validators.js?v=1.1.124-location-icon-upload";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.124-location-icon-upload";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.124-location-icon-upload";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.124-location-icon-upload";
import { catalogCourseFetchByIdProcessing } from "../../stages/process/processors.js?v=1.1.124-location-icon-upload";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.124-location-icon-upload";

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

