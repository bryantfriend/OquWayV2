import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.109-student-assignment-status-fallback";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
