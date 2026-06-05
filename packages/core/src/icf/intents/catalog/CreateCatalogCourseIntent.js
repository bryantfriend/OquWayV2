import { catalogCourseRequireTitleValidation } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { catalogCourseNormalizeTitleNormalization } from "../../stages/normalize/normalizers.js?v=1.1.62-external-task-review-loop";
import { catalogAttachSystemContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { catalogRequireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { catalogCourseCreateRecordProcessing } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

export function CreateCatalogCourseIntent() {
    return {
        type: "CreateCatalogCourseIntent",
        validate: [
            catalogCourseRequireTitleValidation
        ],
        normalize: [
            catalogCourseNormalizeTitleNormalization
        ],
        addContext: [
            catalogAttachSystemContext
        ],
        authorize: [
            catalogRequireCourseCreatorAuthorization
        ],
        process: [
            catalogCourseCreateRecordProcessing
        ],
        emit: [
            emitIntentResult
        ]
    };
}

