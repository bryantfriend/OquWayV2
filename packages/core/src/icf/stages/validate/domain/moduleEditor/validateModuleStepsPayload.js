import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
