import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireSuperAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { preventDeleteIfInUseAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { catalogCourseDeleteProcessing } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

export function DeleteCatalogCourseIntent() {
    return {
        type: "DeleteCatalogCourseIntent",
        validate: [],
        normalize: [],
        addContext: [
            attachActorContext,
            attachTimestampContext,
            attachUpdatedByContext,
            attachExistingCourseContext
        ],
        authorize: [
            requireSuperAdminAuthorization,
            preventDeleteIfInUseAuthorization
        ],
        process: [
            catalogCourseDeleteProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

