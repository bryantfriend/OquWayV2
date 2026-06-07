import { requireStringValidation } from "../../validators.js?v=1.1.117-student-identity-binding";

export function validateFieldValueType(executionState) {
    const { payload } = executionState;
    if (payload.value === undefined) {
        return {
            valid: false,
            errors: [{ field: "value", message: "Value cannot be undefined" }]
        };
    }
    return { valid: true };
}
