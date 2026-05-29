import { attachActorContext } from "../../stages/addContext/contexts.js";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js";
import { attachExistingVersionContext } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { catalogCourseRevertVersionProcessing } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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

