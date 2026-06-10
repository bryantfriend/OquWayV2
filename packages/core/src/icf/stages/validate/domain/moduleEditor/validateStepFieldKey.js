import { requireStringValidation } from "../../validators.js?v=1.1.162-modal-stack";

export function validateStepFieldKey(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
