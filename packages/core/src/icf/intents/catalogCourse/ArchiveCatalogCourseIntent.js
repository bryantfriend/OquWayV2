import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { catalogCourseArchiveProcessing } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

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

