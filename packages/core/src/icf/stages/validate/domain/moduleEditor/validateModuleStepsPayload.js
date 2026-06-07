import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.120-student-course-debug-summary";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
