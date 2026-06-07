import { requireStringValidation } from "../../validators.js?v=1.1.117-student-identity-binding";

export function validateFieldExistsInSchema(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
