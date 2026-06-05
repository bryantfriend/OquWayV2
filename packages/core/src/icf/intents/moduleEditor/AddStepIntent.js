import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { attachStepRegistryDefinitionForStep, attachStepsCollection } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { processAddStep } from "../../stages/process/processors.js?v=1.1.63-external-task-student-feedback";
import { validateCourseId, validateModuleId, validateStepTypeRegistered } from "../../stages/validate/validators.js?v=1.1.63-external-task-student-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.63-external-task-student-feedback";

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
