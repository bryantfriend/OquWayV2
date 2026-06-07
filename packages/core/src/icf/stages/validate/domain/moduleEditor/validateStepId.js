import { requireStringValidation } from "../../validators.js?v=1.1.119-student-dashboard-debug-safe";

export function validateStepId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.stepId, "stepId");
}
