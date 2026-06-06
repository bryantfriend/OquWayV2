import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.81-class-command-center";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.81-class-command-center";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.81-class-command-center";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.81-class-command-center";
import { catalogCourseRestoreProcessing } from "../../stages/process/processors.js?v=1.1.81-class-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.81-class-command-center";

export function RestoreCatalogCourseIntent() {
    return {
        type: "RestoreCatalogCourseIntent",
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
            catalogCourseRestoreProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

