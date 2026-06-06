import { requireStringValidation } from "../../validators.js?v=1.1.79-user-command-center";

export function validateStepTypeRegistered(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.stepType, "stepType");
}
