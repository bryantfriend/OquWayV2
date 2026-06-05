import { catalogCourseRequireTitleValidation } from "../../stages/validate/validators.js?v=1.1.63-external-task-student-feedback";
import { catalogCourseNormalizeTitleNormalization } from "../../stages/normalize/normalizers.js?v=1.1.63-external-task-student-feedback";
import { catalogAttachSystemContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { catalogRequireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { catalogCourseCreateRecordProcessing } from "../../stages/process/processors.js?v=1.1.63-external-task-student-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.63-external-task-student-feedback";

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

