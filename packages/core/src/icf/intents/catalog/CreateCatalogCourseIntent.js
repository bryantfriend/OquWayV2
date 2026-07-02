import { catalogCourseRequireTitleValidation } from "../../stages/validate/validators.js?v=1.1.219-course-creator-all-courses";
import { catalogCourseNormalizeTitleNormalization } from "../../stages/normalize/normalizers.js?v=1.1.219-course-creator-all-courses";
import { catalogAttachSystemContext } from "../../stages/addContext/contexts.js?v=1.1.219-course-creator-all-courses";
import { catalogRequireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.219-course-creator-all-courses";
import { catalogCourseCreateRecordProcessing } from "../../stages/process/processors.js?v=1.1.219-course-creator-all-courses";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.219-course-creator-all-courses";

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

