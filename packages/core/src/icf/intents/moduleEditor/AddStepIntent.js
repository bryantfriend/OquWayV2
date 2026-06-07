import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { attachStepRegistryDefinitionForStep, attachStepsCollection } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { processAddStep } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { validateCourseId, validateModuleId, validateStepTypeRegistered } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

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
