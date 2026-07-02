import { catalogCourseRequireCourseIdValidation } from "../../stages/validate/validators.js?v=1.1.219-course-creator-all-courses";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.219-course-creator-all-courses";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.219-course-creator-all-courses";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.219-course-creator-all-courses";
import { catalogCourseFetchByIdProcessing } from "../../stages/process/processors.js?v=1.1.219-course-creator-all-courses";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.219-course-creator-all-courses";

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

