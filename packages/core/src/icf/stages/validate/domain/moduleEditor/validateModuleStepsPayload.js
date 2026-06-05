import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
