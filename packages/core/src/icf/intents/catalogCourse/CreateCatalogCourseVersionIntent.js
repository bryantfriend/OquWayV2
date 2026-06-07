import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { attachTimestampContext, attachCreatedByContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { requireCourseCreatorOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { catalogCourseCreateVersionProcessing } from "../../stages/process/processors.js?v=1.1.113-student-rules-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.113-student-rules-read";

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

