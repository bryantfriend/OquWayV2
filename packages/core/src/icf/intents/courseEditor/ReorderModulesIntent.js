import { validateAuthenticated, validateCourseId, validateOrderBounds } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.62-external-task-review-loop";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachCourseDocument, attachModulesCollection } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { processReorderModules } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

export function ReorderModulesIntent() {
    return {
        type: "ReorderModulesIntent",
        validate: [
            validateAuthenticated,
            validateCourseId,
            validateOrderBounds
        ],
        normalize: [
            normalizeCourseId
        ],
        addContext: [
            attachActorContext,
            attachActorRoleContext,
            attachCourseDocument,
            attachModulesCollection
        ],
        authorize: [
            requireCourseCreatorAuthorization
        ],
        process: [
            processReorderModules
        ],
        emit: [
            emitIntentResult
        ]
    };
}

