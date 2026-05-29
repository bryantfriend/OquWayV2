import { catalogCourseRequireTitleValidation } from "../../stages/validate/validators.js";
import { catalogCourseNormalizeTitleNormalization } from "../../stages/normalize/normalizers.js";
import { catalogAttachSystemContext } from "../../stages/addContext/contexts.js";
import { catalogRequireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { catalogCourseCreateRecordProcessing } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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

