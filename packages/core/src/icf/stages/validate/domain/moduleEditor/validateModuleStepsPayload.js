import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.114-student-profile-rules";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
