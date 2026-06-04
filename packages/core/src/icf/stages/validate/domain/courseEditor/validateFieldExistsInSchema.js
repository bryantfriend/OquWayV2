import { requireStringValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";

export function validateFieldExistsInSchema(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
