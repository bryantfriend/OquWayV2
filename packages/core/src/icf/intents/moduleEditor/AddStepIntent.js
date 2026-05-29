import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { attachStepRegistryDefinitionForStep, attachStepsCollection } from "../../stages/addContext/contexts.js";
import { processAddStep } from "../../stages/process/processors.js";
import { validateCourseId, validateModuleId, validateStepTypeRegistered } from "../../stages/validate/validators.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
