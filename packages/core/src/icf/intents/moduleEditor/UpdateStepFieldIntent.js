import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { attachStepsCollection } from "../../stages/addContext/contexts.js";
import { processUpdateStepField } from "../../stages/process/processors.js";
import { validateCourseId, validateModuleId, validateStepFieldKey, validateStepId } from "../../stages/validate/validators.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
