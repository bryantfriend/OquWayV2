import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.219-course-creator-all-courses";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.219-course-creator-all-courses";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.219-course-creator-all-courses";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.219-course-creator-all-courses";
import { catalogCourseArchiveProcessing } from "../../stages/process/processors.js?v=1.1.219-course-creator-all-courses";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.219-course-creator-all-courses";

export function ArchiveCatalogCourseIntent() {
    return {
        type: "ArchiveCatalogCourseIntent",
        validate: [],
        normalize: [],
        addContext: [
            attachActorContext,
            attachTimestampContext,
            attachUpdatedByContext,
            attachExistingCourseContext
        ],
        authorize: [
            requireCourseCreatorOwnershipAuthorization
        ],
        process: [
            catalogCourseArchiveProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

