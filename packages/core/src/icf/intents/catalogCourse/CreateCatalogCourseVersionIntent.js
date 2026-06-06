import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.81-class-command-center";
import { attachTimestampContext, attachCreatedByContext } from "../../stages/addContext/contexts.js?v=1.1.81-class-command-center";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.81-class-command-center";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.81-class-command-center";
import { catalogCourseCreateVersionProcessing } from "../../stages/process/processors.js?v=1.1.81-class-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.81-class-command-center";

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

