import { requireStringValidation } from "../../validators.js?v=1.1.78-location-command-center";

export function validateStepTypeRegistered(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.stepType, "stepType");
}
