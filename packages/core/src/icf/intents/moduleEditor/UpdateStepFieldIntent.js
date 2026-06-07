import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { attachStepsCollection } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { processUpdateStepField } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { validateCourseId, validateModuleId, validateStepFieldKey, validateStepId } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

export function UpdateStepFieldIntent() {
    return {
        type: "UpdateStepFieldIntent",
        validate: [
            validateCourseId,
            validateModuleId,
            validateStepId,
            validateStepFieldKey
        ],
        normalize: [],
        addContext: [
            attachStepsCollection
        ],
        authorize: [
            requireCourseCreatorAuthorization
        ],
        process: [
            processUpdateStepField
        ],
        emit: [
            emitIntentResult
        ]
    };
}
