import { catalogAttachSystemContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { catalogRequireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { catalogCourseFetchAllProcessing } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

export function FetchAllCatalogCoursesIntent() {
    return {
        type: "FetchAllCatalogCoursesIntent",
        validate: [],
        normalize: [],
        addContext: [
            catalogAttachSystemContext
        ],
        authorize: [
            catalogRequireCourseCreatorAuthorization
        ],
        process: [
            catalogCourseFetchAllProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

