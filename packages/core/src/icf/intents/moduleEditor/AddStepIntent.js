import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.124-location-icon-upload";
import { attachStepRegistryDefinitionForStep, attachStepsCollection } from "../../stages/addContext/contexts.js?v=1.1.154-emotional-check-in-prototype";
import { processAddStep } from "../../stages/process/processors.js?v=1.1.154-emotional-check-in-prototype";
import { validateCourseId, validateModuleId, validateStepTypeRegistered } from "../../stages/validate/validators.js?v=1.1.154-emotional-check-in-prototype";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.124-location-icon-upload";

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
