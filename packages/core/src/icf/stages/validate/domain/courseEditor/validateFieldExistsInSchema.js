import { requireStringValidation } from "../../validators.js?v=1.1.124-location-icon-upload";

export function validateFieldExistsInSchema(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
