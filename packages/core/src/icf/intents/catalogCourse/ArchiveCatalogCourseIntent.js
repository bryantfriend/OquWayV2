import { attachActorContext } from "../../stages/addContext/contexts.js";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js";
import { catalogCourseArchiveProcessing } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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

