import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { catalogCourseFetchAllProcessing } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

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

