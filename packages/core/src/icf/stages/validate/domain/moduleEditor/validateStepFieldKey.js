import { requireStringValidation } from "../../validators.js?v=1.1.118-fruit-login-student-identity";

export function validateStepFieldKey(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
