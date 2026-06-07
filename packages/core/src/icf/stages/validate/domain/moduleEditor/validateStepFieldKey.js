import { requireStringValidation } from "../../validators.js?v=1.1.116-student-token-ready";

export function validateStepFieldKey(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
