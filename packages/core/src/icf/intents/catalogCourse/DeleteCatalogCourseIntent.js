import { attachActorContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { attachTimestampContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { attachExistingCourseContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { requireSuperAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { preventDeleteIfInUseAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { catalogCourseDeleteProcessing } from "../../stages/process/processors.js?v=1.1.63-external-task-student-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.63-external-task-student-feedback";

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

