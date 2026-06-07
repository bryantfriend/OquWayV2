import { requireStringValidation } from "../../validators.js?v=1.1.113-student-rules-read";

export function validateStepId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.stepId, "stepId");
}
