import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { attachStepRegistryDefinitionForStep, attachStepsCollection } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { processAddStep } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { validateCourseId, validateModuleId, validateStepTypeRegistered } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

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
