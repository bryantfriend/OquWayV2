import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.112-student-assignment-error-debug";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.112-student-assignment-error-debug";
import { catalogCourseFetchAllProcessing } from "../../stages/process/processors.js?v=1.1.112-student-assignment-error-debug";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.112-student-assignment-error-debug";

export function FetchAllCatalogCoursesIntent() {
    return {
        type: "FetchAllCatalogCoursesIntent",
        validate: [],
        normalize: [],
        addContext: [
            attachActorContext,
            attachActorRoleContext
        ],
        authorize: [
            requireCourseCreatorAuthorization
        ],
        process: [
            catalogCourseFetchAllProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

