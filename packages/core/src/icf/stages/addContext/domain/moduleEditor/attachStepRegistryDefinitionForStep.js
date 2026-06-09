import { getStepTypeDefinition } from "../../../../../shared/stepTypes/stepTypeRegistry.js?v=1.1.136-emotional-check-in";

export async function attachStepRegistryDefinitionForStep(executionState) {
    const { payload } = executionState;
    if (!payload.stepType) return { valid: true };
    const StepTypeDefinition = getStepTypeDefinition(payload.stepType);

    if (!StepTypeDefinition) {
        return {
            valid: false,
            errors: [
                {
                    code: "STEP_TYPE_UNSUPPORTED",
                    message: "Unsupported step type: " + payload.stepType
                }
            ]
        };
    }

    return {
        valid: true,
        data: {
            stepDefinition: {
                type: payload.stepType,
                defaultConfig: StepTypeDefinition.createConfig()
            }
        }
    };
}
