import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.118-fruit-login-student-identity";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
