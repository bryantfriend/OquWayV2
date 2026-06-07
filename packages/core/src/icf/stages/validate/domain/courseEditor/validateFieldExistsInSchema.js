import { requireStringValidation } from "../../validators.js?v=1.1.111-student-assignment-debug-panel";

export function validateFieldExistsInSchema(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
