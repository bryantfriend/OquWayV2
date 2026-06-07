import { requireStringValidation } from "../../validators.js?v=1.1.118-fruit-login-student-identity";

export function validateStepId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.stepId, "stepId");
}
