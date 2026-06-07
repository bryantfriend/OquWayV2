import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { catalogCourseArchiveProcessing } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

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

