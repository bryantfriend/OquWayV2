import { catalogCourseRequireCourseIdValidation } from "../../stages/validate/validators.js?v=1.1.109-student-assignment-status-fallback";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.109-student-assignment-status-fallback";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.109-student-assignment-status-fallback";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.109-student-assignment-status-fallback";
import { catalogCourseFetchVersionsProcessing } from "../../stages/process/processors.js?v=1.1.109-student-assignment-status-fallback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.109-student-assignment-status-fallback";

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

