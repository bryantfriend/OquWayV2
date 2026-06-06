import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.80-course-module-command-center";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
