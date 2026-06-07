import { requireStringValidation } from "../../validators.js?v=1.1.116-student-token-ready";

export function validateFieldExistsInSchema(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
