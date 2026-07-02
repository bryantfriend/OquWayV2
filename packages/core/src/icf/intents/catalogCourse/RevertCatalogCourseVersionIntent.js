import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.219-course-creator-all-courses";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.219-course-creator-all-courses";
import { attachExistingVersionContext } from "../../stages/addContext/contexts.js?v=1.1.219-course-creator-all-courses";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.219-course-creator-all-courses";
import { catalogCourseRevertVersionProcessing } from "../../stages/process/processors.js?v=1.1.219-course-creator-all-courses";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.219-course-creator-all-courses";

export function RevertCatalogCourseVersionIntent() {
    return {
        type: "RevertCatalogCourseVersionIntent",
        validate: [],
        normalize: [],
        addContext: [
            attachActorContext,
            attachTimestampContext,
            attachUpdatedByContext,
            attachExistingVersionContext
        ],
        authorize: [
            requireCourseCreatorAuthorization
        ],
        process: [
            catalogCourseRevertVersionProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

