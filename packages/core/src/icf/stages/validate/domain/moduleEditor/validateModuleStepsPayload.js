import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.29-module-render-fix";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
