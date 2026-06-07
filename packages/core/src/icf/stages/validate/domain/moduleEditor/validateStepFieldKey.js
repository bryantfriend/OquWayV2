import { requireStringValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";

export function validateStepFieldKey(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
