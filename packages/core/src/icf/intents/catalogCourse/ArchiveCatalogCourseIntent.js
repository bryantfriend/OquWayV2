import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { catalogCourseArchiveProcessing } from "../../stages/process/processors.js?v=1.1.113-student-rules-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.113-student-rules-read";

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

