import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.119-student-dashboard-debug-safe";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
