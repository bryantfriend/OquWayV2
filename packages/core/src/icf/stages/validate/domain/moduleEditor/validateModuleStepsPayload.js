import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.110-student-class-alias-query";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
