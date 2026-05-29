import { attachActorContext } from "../../stages/addContext/contexts.js";
import { attachTimestampContext, attachCreatedByContext } from "../../stages/addContext/contexts.js";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js";
import { catalogCourseCreateVersionProcessing } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function CreateCatalogCourseVersionIntent() {
    return {
        type: "CreateCatalogCourseVersionIntent",
        validate: [],
        normalize: [],
        addContext: [
            attachActorContext,
            attachTimestampContext,
            attachCreatedByContext,
            attachExistingCourseContext
        ],
        authorize: [
            requireCourseCreatorOwnershipAuthorization
        ],
        process: [
            catalogCourseCreateVersionProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

