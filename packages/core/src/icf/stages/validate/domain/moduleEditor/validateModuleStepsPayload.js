import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.162-modal-stack";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
