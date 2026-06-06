import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.108-student-class-alias-merge";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
