import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.124-location-icon-upload";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
