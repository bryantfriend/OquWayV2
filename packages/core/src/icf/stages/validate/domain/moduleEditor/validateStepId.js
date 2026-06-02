import { requireStringValidation } from "../../validators.js?v=1.1.29-module-render-fix";

export function validateStepId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.stepId, "stepId");
}
