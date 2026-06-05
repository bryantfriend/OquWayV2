import { requireStringValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";

export function validateFieldExistsInSchema(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
