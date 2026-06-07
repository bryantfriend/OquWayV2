import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.111-student-assignment-debug-panel";
import { attachTimestampContext, attachCreatedByContext } from "../../stages/addContext/contexts.js?v=1.1.111-student-assignment-debug-panel";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.111-student-assignment-debug-panel";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.111-student-assignment-debug-panel";
import { catalogCourseCreateVersionProcessing } from "../../stages/process/processors.js?v=1.1.111-student-assignment-debug-panel";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.111-student-assignment-debug-panel";

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

