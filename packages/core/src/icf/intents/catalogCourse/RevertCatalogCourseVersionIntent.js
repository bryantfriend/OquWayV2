import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.109-student-assignment-status-fallback";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.109-student-assignment-status-fallback";
import { attachExistingVersionContext } from "../../stages/addContext/contexts.js?v=1.1.109-student-assignment-status-fallback";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.109-student-assignment-status-fallback";
import { catalogCourseRevertVersionProcessing } from "../../stages/process/processors.js?v=1.1.109-student-assignment-status-fallback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.109-student-assignment-status-fallback";

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

