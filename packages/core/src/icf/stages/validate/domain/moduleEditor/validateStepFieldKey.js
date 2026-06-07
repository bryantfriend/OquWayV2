import { requireStringValidation } from "../../validators.js?v=1.1.113-student-rules-read";

export function validateStepFieldKey(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
