import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.116-student-token-ready";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
