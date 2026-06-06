import { requireStringValidation } from "../../validators.js?v=1.1.80-course-module-command-center";

export function validateStepFieldKey(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
