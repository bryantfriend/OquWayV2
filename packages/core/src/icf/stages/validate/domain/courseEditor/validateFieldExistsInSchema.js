import { requireStringValidation } from "../../validators.js?v=1.1.113-student-rules-read";

export function validateFieldExistsInSchema(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
