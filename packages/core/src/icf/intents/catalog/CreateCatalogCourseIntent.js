import { catalogCourseRequireTitleValidation } from "../../stages/validate/validators.js?v=1.1.112-student-assignment-error-debug";
import { catalogCourseNormalizeTitleNormalization } from "../../stages/normalize/normalizers.js?v=1.1.112-student-assignment-error-debug";
import { catalogAttachSystemContext } from "../../stages/addContext/contexts.js?v=1.1.112-student-assignment-error-debug";
import { catalogRequireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.112-student-assignment-error-debug";
import { catalogCourseCreateRecordProcessing } from "../../stages/process/processors.js?v=1.1.112-student-assignment-error-debug";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.112-student-assignment-error-debug";

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

