import { catalogCourseRequireCourseIdValidation } from "../../stages/validate/validators.js?v=1.1.162-modal-stack";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.162-modal-stack";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.162-modal-stack";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.162-modal-stack";
import { catalogCourseFetchVersionsProcessing } from "../../stages/process/processors.js?v=1.1.162-modal-stack";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.162-modal-stack";

export function FetchCatalogCourseVersionsIntent() {
    return {
        type: "FetchCatalogCourseVersionsIntent",
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
            catalogCourseFetchVersionsProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

