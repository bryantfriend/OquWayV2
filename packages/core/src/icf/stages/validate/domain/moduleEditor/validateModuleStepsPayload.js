import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.113-student-rules-read";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
