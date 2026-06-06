import { requireStringValidation } from "../../validators.js?v=1.1.108-student-class-alias-merge";

export function validateStepId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.stepId, "stepId");
}
