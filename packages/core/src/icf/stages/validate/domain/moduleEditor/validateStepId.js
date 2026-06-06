import { requireStringValidation } from "../../validators.js?v=1.1.82-shared-command-center-shell";

export function validateStepId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.stepId, "stepId");
}
