import { requireStringValidation } from "../../validators.js?v=1.1.124-location-icon-upload";

export function validateStepId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.stepId, "stepId");
}
