import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { attachStepRegistryDefinitionForStep, attachStepsCollection } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { processAddStep } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { validateCourseId, validateModuleId, validateStepTypeRegistered } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

export function AddStepIntent() {
    return {
        type: "AddStepIntent",
        validate: [
            validateCourseId,
            validateModuleId,
            validateStepTypeRegistered
        ],
        normalize: [],
        addContext: [
            attachStepsCollection,
            attachStepRegistryDefinitionForStep
        ],
        authorize: [
            requireCourseCreatorAuthorization
        ],
        process: [
            processAddStep
        ],
        emit: [
            emitIntentResult
        ]
    };
}
