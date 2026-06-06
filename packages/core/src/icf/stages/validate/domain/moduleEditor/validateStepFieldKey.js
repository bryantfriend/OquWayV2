import { requireStringValidation } from "../../validators.js?v=1.1.82-shared-command-center-shell";

export function validateStepFieldKey(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
