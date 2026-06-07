import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.121-student-dashboard-open-clean";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
