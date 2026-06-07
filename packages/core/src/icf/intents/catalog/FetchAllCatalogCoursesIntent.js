import { catalogAttachSystemContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { catalogRequireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { catalogCourseFetchAllProcessing } from "../../stages/process/processors.js?v=1.1.113-student-rules-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.113-student-rules-read";

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

