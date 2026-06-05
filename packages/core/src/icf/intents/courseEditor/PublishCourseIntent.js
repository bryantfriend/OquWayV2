import { validateAuthenticated, validateCourseId, validateCoursePublishReady } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.62-external-task-review-loop";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { attachCourseDocument, attachModulesCollection } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { processPublishCourse } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

export function PublishCourseIntent() {
    return {
        type: "PublishCourseIntent",
        validate: [
            validateAuthenticated,
            validateCourseId,
            validateCoursePublishReady
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
            processPublishCourse
        ],
        emit: [
            emitIntentResult
        ]
    };
}

