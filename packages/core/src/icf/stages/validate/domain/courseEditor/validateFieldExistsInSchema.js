import { requireStringValidation } from "../../validators.js?v=1.1.109-student-assignment-status-fallback";

export function validateFieldExistsInSchema(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
