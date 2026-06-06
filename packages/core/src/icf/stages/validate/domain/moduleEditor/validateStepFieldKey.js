import { requireStringValidation } from "../../validators.js?v=1.1.107-student-firebase-auth-chain";

export function validateStepFieldKey(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
