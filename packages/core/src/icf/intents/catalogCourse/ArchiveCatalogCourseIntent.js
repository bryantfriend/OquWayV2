import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { catalogCourseArchiveProcessing } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

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

