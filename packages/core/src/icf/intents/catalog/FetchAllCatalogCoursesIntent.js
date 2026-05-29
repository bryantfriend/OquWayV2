import { catalogAttachSystemContext } from "../../stages/addContext/contexts.js";
import { catalogRequireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { catalogCourseFetchAllProcessing } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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

