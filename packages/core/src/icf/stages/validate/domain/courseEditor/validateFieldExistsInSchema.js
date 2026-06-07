import { requireStringValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";

export function validateFieldExistsInSchema(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
