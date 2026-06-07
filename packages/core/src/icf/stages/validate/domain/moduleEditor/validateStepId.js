import { requireStringValidation } from "../../validators.js?v=1.1.117-student-identity-binding";

export function validateStepId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.stepId, "stepId");
}
