import { requireStringValidation } from "../../validators.js?v=1.1.81-class-command-center";

export function validateStepId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.stepId, "stepId");
}
