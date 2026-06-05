import { requireStringValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";

export function validateStepId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.stepId, "stepId");
}
