import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
