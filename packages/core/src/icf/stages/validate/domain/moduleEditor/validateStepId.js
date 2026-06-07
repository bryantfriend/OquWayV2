import { requireStringValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";

export function validateStepId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.stepId, "stepId");
}
