import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.219-course-creator-all-courses";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.219-course-creator-all-courses";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.219-course-creator-all-courses";
import { requireSuperAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.219-course-creator-all-courses";
import { preventDeleteIfInUseAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.219-course-creator-all-courses";
import { catalogCourseDeleteProcessing } from "../../stages/process/processors.js?v=1.1.219-course-creator-all-courses";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.219-course-creator-all-courses";

export function DeleteCatalogCourseIntent() {
    return {
        type: "DeleteCatalogCourseIntent",
        validate: [],
        normalize: [],
        addContext: [
            attachActorContext,
            attachTimestampContext,
            attachUpdatedByContext,
            attachExistingCourseContext
        ],
        authorize: [
            requireSuperAdminAuthorization,
            preventDeleteIfInUseAuthorization
        ],
        process: [
            catalogCourseDeleteProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

