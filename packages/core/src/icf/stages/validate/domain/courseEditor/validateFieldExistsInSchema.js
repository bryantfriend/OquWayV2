import { requireStringValidation } from "../../validators.js?v=1.1.118-fruit-login-student-identity";

export function validateFieldExistsInSchema(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
