import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.111-student-assignment-debug-panel";

export function validateModuleStepsPayload(executionState) {
    const payload = executionState.payload;
    return requireNonEmptyArrayValidation(payload.steps, "steps");
}
