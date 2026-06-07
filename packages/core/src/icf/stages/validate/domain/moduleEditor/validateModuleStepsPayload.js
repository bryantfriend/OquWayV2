import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.117-student-identity-binding";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
